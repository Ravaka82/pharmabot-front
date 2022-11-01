import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {Client} from "../../@core/interfaces";
import {IConfirmationDialog} from "../../@core/interfaces/confirmation-dialog.interface";
import {ColumnMode, DatatableComponent, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {select, Store} from "@ngrx/store";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {ModalConfirmationService} from "../../@core/services/modal-confirmation.service";
import {DatePipe} from "@angular/common";
import {takeUntil} from "rxjs/operators";
import {ClientSelector} from "../../@core/store/selectors";
import {ClientActions} from "../../@core/store/actions";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientsComponent extends UnsubscribeComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rowSelected: Client.Entry[] = [];
  lastSelectedClientId!: string;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;

  rows: Client.Entry[] = [];
  columns: TableColumn[] = [];
  loading: boolean = false;

  @ViewChild('table', {static: true}) table!: DatatableComponent;
  @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
  @ViewChild('officeNumberTemplate', {static: true}) officeNumberTemplate!: TemplateRef<any>;
  @ViewChild('phoneNumberTemplate', {static: true}) phoneNumberTemplate!: TemplateRef<any>;

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
      select(ClientSelector.selectAll)
    ).subscribe(rows => {
      this.rows = [...rows];
    });

    this.columns = [
      { name: 'Nom', prop: 'name' },
      { name: 'Contact bureau', prop: 'officeNumber', cellTemplate: this.officeNumberTemplate },
      { name: 'Contact', prop: 'phoneNumber', cellTemplate: this.phoneNumberTemplate },
      { name: 'Date de création', prop:'createdAt', pipe: this.datePipe('dd/MM/YYYY HH:mm:ss') },
      { name: 'Mis à jour', prop:'updatedAt', pipe: this.datePipe('dd/MM/YYYY HH:mm:ss') },
      { name: 'Actions', cellTemplate: this.actionTemplate, width: 195 },
    ];

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ClientSelector.selectLoading)
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
            content: `Le client <b>${this.rowSelected[0]?.name}</b> a été supprimé avec succès`
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

  deleteClient(row: Client.Entry): void {
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
        this.store.dispatch(ClientActions.DELETE_REQUESTED({
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
