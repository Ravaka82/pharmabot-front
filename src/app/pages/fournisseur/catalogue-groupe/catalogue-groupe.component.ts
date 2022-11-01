import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {CatalogueGroupe} from "../../../@core/interfaces";
import {IConfirmationDialog} from "../../../@core/interfaces/confirmation-dialog.interface";
import {select, Store} from "@ngrx/store";
import {ModalConfirmationService} from "../../../@core/services/modal-confirmation.service";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {DatePipe} from "@angular/common";
import {takeUntil} from "rxjs/operators";
import {CatalogueGroupeSelector} from "../../../@core/store/selectors";
import {CatalogueGroupeActions} from "../../../@core/store/actions";

@Component({
  selector: 'app-catalogue-groupe',
  templateUrl: './catalogue-groupe.component.html',
  styleUrls: ['./catalogue-groupe.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueGroupeComponent extends UnsubscribeComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rowSelected: CatalogueGroupe.CatalogueGroupePage[] = [];
  lastSelectedCatalogueGroupeId!: string;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;

  rows: CatalogueGroupe.CatalogueGroupePage[] = [];
  columns: TableColumn[] = [];

  @ViewChild('groupTemplate', {static: true}) groupTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
  @ViewChild('activeTemplate', {static: true}) activeTemplate!: TemplateRef<any>;

  constructor(
    protected store: Store,
    private modalRef: MatDialog,
    private _adapter: DateAdapter<any>,
    private modalConfirmation: ModalConfirmationService,
    private _datePipe: DatePipe
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
    CatalogueGroupeSelector
      .selectCatalogueGroupeWithPageCount$(this.store)
      .pipe(
        takeUntil(super.unsubscribe()),
      ).subscribe(rows => {
      this.rows = [...rows];
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueGroupeSelector.selectLoading)
    ).subscribe(loading => {
      if (!loading && this.isDeleting) {
        this.itemDelete.loading = false;
        this.modalRef.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/notification.json',
            title: 'Notification',
            showConfirm: true,
            confirmLabel: 'OK',
            content: `Le groupe <b>${this.rowSelected[0]?.name}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.rowSelected = [];
        this.isDeleting = false;
      }
    })

    this.columns = [
      { name: 'Groupe', cellTemplate: this.groupTemplate, width: 125 },
      { name: 'Active', cellTemplate: this.activeTemplate, width: 100 },
      { name: 'Catalogue(s)', prop: 'catalogueCount', width: 100 },
      { name: 'Utilisateur(s)', prop: 'userCount', width: 100 },
      { name: '', cellTemplate: this.actionTemplate, width: 100 }
    ];
  }

  datePipe (format: string) {
    return {
      transform: (value: any) => this._datePipe.transform(value, format)};
  }

  addGroup(): void {
    this.store.dispatch(CatalogueGroupeActions.CREATE_REQUESTED({
      input: {
        name: 'Nouveau'
      }
    }))
  }

  deleteGroup(row: CatalogueGroupe.CatalogueGroupePage): void {
    this.store.dispatch(CatalogueGroupeActions.SELECTED({
      catalogueGroupeId: row.id
    }))
    this.lastSelectedCatalogueGroupeId = row.id;
    this.rowSelected = [row];
    this.itemDelete = {
      title: 'ATTENTION',
      content: '<p>Voulez-vous vraiment supprimer cet élément?</p>',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/alert.json',
      onConfirm: (data: IConfirmationDialog) => {
        data.loading = true;
        this.isDeleting = true;
        this.store.dispatch(CatalogueGroupeActions.DELETE_REQUESTED({
          input: { _id: row.id }
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

  getRowClass = (row: CatalogueGroupe.CatalogueGroupePage) => {
    return {
      'row-selected': (this.rowSelected && this.rowSelected[0]?.id) === row.id
    }
  }

  saveUpdate({id, name, active}: CatalogueGroupe.CatalogueGroupePage): void {
    this.store.dispatch(CatalogueGroupeActions.UPDATE_REQUESTED({ id, changes: { name, active } }))
  }

  selectedRow(): void {
    if (this.rowSelected[0]?.id !== this.lastSelectedCatalogueGroupeId) {
      this.store.dispatch(CatalogueGroupeActions.SELECTED({
        catalogueGroupeId: this.rowSelected[0]?.id
      }))
      this.lastSelectedCatalogueGroupeId = this.rowSelected[0]?.id;
    }
  }
}
