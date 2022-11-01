import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColumnMode, DatatableComponent, SelectionType, TableColumn } from '@swimlane/ngx-datatable';
import { IConfirmationDialog } from 'src/app/@core/interfaces/confirmation-dialog.interface';
import { ModalConfirmationService } from 'src/app/@core/services/modal-confirmation.service';
import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {takeUntil} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import { BonDeCommande } from 'src/app/@core/interfaces';
import { BonDeCommandeSelector } from 'src/app/@core/store/selectors';
import { BonDeCommandeActions } from 'src/app/@core/store/actions';


@Component({
  selector: 'app-bon-de-commande',
  templateUrl: './bon-de-commande.component.html',
  styleUrls: ['./bon-de-commande.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BonDeCommandeComponent extends UnsubscribeComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rowSelected: BonDeCommande.Entry[] = [];
  lastSelectedClientId!: string;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;

  rows: BonDeCommande.Entry[] = [];
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
      select(BonDeCommandeSelector.selectAll)
    ).subscribe(rows => {
      this.rows = rows;
      console.log("kk"+rows)
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(BonDeCommandeSelector.selectLoading)
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
            content: `Le client <b>${this.rowSelected[0]?.archive?.designation}</b> a été supprimé avec succès`
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

  deleteBonDeCommande(row: BonDeCommande.Entry): void {
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
        this.store.dispatch(BonDeCommandeActions.DELETE_REQUESTED({
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
