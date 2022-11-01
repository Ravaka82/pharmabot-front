import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColumnMode, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {DatePipe} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {CatalogueGroupe, Fournisseur} from "../../../@core/interfaces";
import {IConfirmationDialog} from "../../../@core/interfaces/confirmation-dialog.interface";
import {ModalConfirmationService} from "../../../@core/services/modal-confirmation.service";
import {filter, takeUntil} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {CatalogueGroupeSelector, FournisseurSelector} from "../../../@core/store/selectors";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {CatalogueGroupeActions, FournisseurActions} from "../../../@core/store/actions";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-fournisseur-entity',
  templateUrl: './fournisseur-entity.component.html',
  styleUrls: ['./fournisseur-entity.component.scss']
})
export class FournisseurEntityComponent extends UnsubscribeComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rows !: Fournisseur.Entry[];
  rowSelected: Fournisseur.Entry[] = [];
  selectedCatalogueGroupe!: CatalogueGroupe.Entry;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;
  columns: TableColumn[] = [];

  @ViewChild('fournisseurTemplate', {static: true}) fournisseurTemplate: TemplateRef<any> | undefined;
  @ViewChild('authorizeTemplate', {static: true}) authorizeTemplate: TemplateRef<any> | undefined;
  @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any> | undefined;

  constructor(
    protected store: Store,
    private _datePipe: DatePipe,
    private modalRef: MatDialog,
    private _adapter: DateAdapter<any>,
    private modalConfirmation: ModalConfirmationService
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  dblClick(): void {
    throw new Error('Method not implemented.');
  }
  focusout(): void {
    throw new Error('Method not implemented.');
  }
  keypressEnter(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(FournisseurSelector.selectAll),
      this.store.select(CatalogueGroupeSelector.selectedCatalogueGroupe)
    ]).pipe(
      takeUntil(super.unsubscribe()),
      filter(([rows, catalogueGroupe]) => !!rows && !!catalogueGroupe)
    ).subscribe(([rows, catalogueGroupe]) => {
      this.selectedCatalogueGroupe = catalogueGroupe;
      this.rows = rows.map(row => ({
        ...row,
        isEditable: false,
        checked: catalogueGroupe.fournisseurs?.indexOf(row._id) > -1,
        disabled: !catalogueGroupe?._id
      }));
    })
    this.columns = [
      { name: 'Fournisseur', prop: 'name', cellTemplate: this.fournisseurTemplate, width: 215 },
      { name: 'Autorisé', cellTemplate: this.authorizeTemplate, width: 80 },
      { name: '', cellTemplate: this.actionTemplate, width: 80 }
    ];

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FournisseurSelector.selectLoading)
    ).subscribe(loading => {
      if (!loading && this.isDeleting) {
        this.itemDelete.loading = false;
        this.modalRef.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/notification.json',
            confirmLabel: 'OK',
            showConfirm: true,
            title: 'Notification',
            content: `Le fournisseur <b>${this.rowSelected[0]?.name}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.rowSelected = [];
        this.isDeleting = false;
      }
    })
  }

  datePipe (format: string) {
    return {
      transform: (value: any) => this._datePipe.transform(value, format)};
  }

  addFournisseur(): void {
    this.store.dispatch(FournisseurActions.CREATE_REQUESTED({
      input: {
        name: 'NOUVEAU'
      }
    }))
  }

  deleteFournisseur(row: Fournisseur.Entry): void {
    this.rowSelected = [row];
    this.itemDelete = {
      title: 'ATTENTION',
      content: '<p>Voulez-vous vraiment supprimer cet élément?</p>',
      cancelLabel: 'Annuler',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/alert.json',
      onConfirm: (data: IConfirmationDialog) => {
        data.loading = true;
        this.isDeleting = true;

        this.updateCatalogueGroupe(row, false);
        this.store.dispatch(FournisseurActions.DELETE_REQUESTED({
          input: { _id: row._id }
        }))
      },
      onCancel: (data: IConfirmationDialog, dialogRef: MatDialogRef<any>) => {
        dialogRef.close();
        this.itemDelete = {};
        this.isDeleting = false;
      },
    }
    this.modalConfirmation.openModal({data: this.itemDelete, disableClose: true});
  }

  saveUpdate({_id, name}: Fournisseur.Entry): void {
    this.store.dispatch(FournisseurActions.UPDATE_REQUESTED({ id: _id, changes: { name } }))
  }

  updateCatalogueGroupe(row: Fournisseur.Entry, checked: boolean): void {
    const catalogueGroupeId = this.selectedCatalogueGroupe._id;
    let fournisseurs: string[] = [...this.selectedCatalogueGroupe.fournisseurs];
    if (checked) {
      fournisseurs.push(row._id)
    } else {
      fournisseurs = fournisseurs.filter(fournisseurId => fournisseurId !== row._id)
    }

    this.store.dispatch(CatalogueGroupeActions.UPDATE_REQUESTED({
      id: catalogueGroupeId,
      changes: {
        fournisseurs
      }
    }))
  }

}
