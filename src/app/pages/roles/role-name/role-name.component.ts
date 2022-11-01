import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {ModalConfirmationService} from "../../../@core/services/modal-confirmation.service";
import {IConfirmationDialog} from "../../../@core/interfaces/confirmation-dialog.interface";
import {Role} from 'src/app/@core/interfaces';
import {Observable} from "rxjs";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {select, Store} from "@ngrx/store";
import {RoleSelector} from "../../../@core/store/selectors";
import {takeUntil} from "rxjs/operators";
import {RolePage} from "../../../@core/interfaces/role.interface";
import {RoleActions} from "../../../@core/store/actions";

@Component({
  selector: 'app-role-name',
  templateUrl: './role-name.component.html',
  styleUrls: ['./role-name.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoleNameComponent extends UnsubscribeComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rows$ !: Observable<Role.RolePage[]>;
  columns: TableColumn[] = [];
  rowSelected: Role.RolePage[] = [];
  lastSelectedRoleId!: string;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;

  @ViewChild('roleTemplate', {static: true}) roleTemplate: TemplateRef<any> | undefined;
  @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any> | undefined;

  constructor(
    protected store: Store,
    private modalRef: MatDialog,
    private _adapter: DateAdapter<any>,
    private modalConfirmation: ModalConfirmationService,
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
    this.rows$ = this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(RoleSelector.selectRoleWithPageCount)
    )

    this.columns = [
      { name: 'Rôle', cellTemplate: this.roleTemplate, width: 250},
      { name: 'Page(s)', prop: 'pageCount' },
      { name: '', cellTemplate: this.actionTemplate }
    ];

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(RoleSelector.selectLoading)
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
            content: `Le rôle <b>${this.rowSelected[0]?.label}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.rowSelected = [];
        this.isDeleting = false;
      }
    })
  }

  addRole(): void {
    this.store.dispatch(RoleActions.CREATE_REQUESTED({
      input: {
        name: 'Nouveau'
      }
    }))
  }

  deleteGroup(row: Role.RolePage): void {
    this.store.dispatch(RoleActions.SELECTED({
      roleId: row.id
    }))
    this.lastSelectedRoleId = row.id;
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
        this.store.dispatch(RoleActions.DELETE_REQUESTED({
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

  saveUpdate({id, label}: Role.RolePage): void {
    this.store.dispatch(RoleActions.UPDATE_REQUESTED({ id, changes: { name: label } }))
  }

  getRowClass = (row: RolePage) => {
    return {
      'row-selected': (this.rowSelected && this.rowSelected[0]?.id) === row.id
    }
  }

  selectedRow(): void {
    if (this.rowSelected[0]?.id !== this.lastSelectedRoleId) {
      this.store.dispatch(RoleActions.SELECTED({
        roleId: this.rowSelected[0]?.id
      }))
      this.lastSelectedRoleId = this.rowSelected[0]?.id;
    }
  }
}
