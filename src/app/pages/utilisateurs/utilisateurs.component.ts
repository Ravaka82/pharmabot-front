import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserViewEditComponent} from "./user-view-edit/user-view-edit.component";
import {DatePipe} from "@angular/common";
import {User} from "../../@core/interfaces";
import {IConfirmationDialog} from "../../@core/interfaces/confirmation-dialog.interface";
import {select, Store} from "@ngrx/store";
import {DateAdapter} from "@angular/material/core";
import {ModalConfirmationService} from "../../@core/services/modal-confirmation.service";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {takeUntil} from "rxjs/operators";
import {AccountSelector, UserSelector} from "../../@core/store/selectors";
import {UserActions} from "../../@core/store/actions";

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UtilisateursComponent extends UnsubscribeComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rowSelected: User.UserPage[] = [];
  lastSelectedUserId!: string;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;

  rows: User.UserPage[] = [];
  columns: TableColumn[] = [];
  loading: boolean = false;
  isAuthorized = false;

  @ViewChild('table', {static: true}) table!: DatatableComponent;
  @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
  @ViewChild('activeTemplate', {static: true}) activeTemplate!: TemplateRef<any>;
  @ViewChild('connectedTemplate', {static: true}) connectedTemplate!: TemplateRef<any>;

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

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(AccountSelector.selectState)
    ).subscribe((account) => {
      this.isAuthorized = account?.role?.name === 'ADMIN';
      this.columns = [
        { name: 'Pseudo', prop: 'pseudo' },
        { name: 'Connecté', cellTemplate: this.connectedTemplate },
        { name: 'Mis à jour', prop:'updatedAt', pipe: this.datePipe('dd/MM/YYYY HH:mm:ss') },
        { name: 'Catalogue groupe', prop: 'catalogueGroupeName' },
        { name: 'Rôle', prop: 'role.name' }
      ];
      if (this.isAuthorized) {
        this.columns.push({ name: 'Actions', cellTemplate: this.actionTemplate, width: 195 })
      }
    });
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(UserSelector.selectUsers)
    ).subscribe(rows => {
      this.rows = [...rows];
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(UserSelector.selectLoading)
    ).subscribe(loading => {
      this.loading = loading;
      if (!loading && this.isDeleting) {
        this.itemDelete.loading = false;
        this.modalRef.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/notification.json',
            title: 'Notification',
            showConfirm: true,
            confirmLabel: 'OK',
            content: `L'utilisateur <b>${this.rowSelected[0]?.pseudo}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.rowSelected = [];
        this.isDeleting = false;
      }
    })
  }

  openModal(): void {
    const dialog = this.modalRef.open(UserViewEditComponent, {
      disableClose: true
    });
  }

  update(row: User.UserPage): void {
    const dialog = this.modalRef.open(UserViewEditComponent, {
      disableClose: true,
      data: row
    });
  }

  updateConnected(row: User.UserPage, checked: boolean): void {
    this.store.dispatch(UserActions.UPDATE_REQUESTED({
      id: row._id,
      changes: { connected: checked }
    }))
  }

  datePipe (format: string) {
    return {
      transform: (value: any) => this._datePipe.transform(value, format)};
  }

  deleteUser(row: User.UserPage): void {
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

        // this.updateCatalogueGroupe(row, false);
        this.store.dispatch(UserActions.DELETE_REQUESTED({
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
}
