import {Component, OnInit, ViewChild} from '@angular/core';
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {History} from "../../@core/interfaces";
import {ColumnMode, DatatableComponent, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {DatePipe} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {select, Store} from "@ngrx/store";
import {ModalConfirmationService} from "../../@core/services/modal-confirmation.service";
import {takeUntil} from "rxjs/operators";
import {HistorySelector} from "../../@core/store/selectors";
import {IConfirmationDialog} from "../../@core/interfaces/confirmation-dialog.interface";
import {HistoryActions} from "../../@core/store/actions";
import {HistoryDetailComponent} from "./history-detail/history-detail.component";
import {EntriesSearch} from "../../utils";
import {map as _map} from 'lodash';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.scss']
})
export class HistoriesComponent extends UnsubscribeComponent implements OnInit {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rows: History.Entry[] = [];
  itemDelete!: any;
  columns: TableColumn[] = [];
  loading: boolean = false;
  isDeleting: boolean = false;
  selected!: History.Entry;
  bulkSelected: string[] = [];
  searchRows!: EntriesSearch<any>;
  searchValue: string = '';

  @ViewChild('table', {static: true}) table !: DatatableComponent;

  constructor
  (private _datePipe: DatePipe,
   private modalRef: MatDialog,
   private _adapter: DateAdapter<any>,
   protected store: Store,
   private modalConfirmation: ModalConfirmationService,
   private modal: MatDialog
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(HistorySelector.selectAll)
    ).subscribe(rows => {
      this.rows = rows;
      this.searchRows = new EntriesSearch([...this.rows]).setColumns(['description', 'action']);
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(HistorySelector.selectLoading)
    ).subscribe(loading => {
      this.loading = loading;
      if (!loading && this.isDeleting) {
        this.itemDelete.loading = false;
        this.modalRef.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/notification.json',
            showConfirm: true,
            confirmLabel: 'OK',
            title: 'Notification',
            content: `Les historiques ont été supprimés avec succès`
          }
        });
        this.itemDelete = {};
        this.isDeleting = false;
        this.bulkSelected = [];
        this.rows = this.searchRows.search(this.searchValue);
      }
    });
  }

  deleteCatalogue(row: History.Entry, isBulkDeleted: boolean = false) {
    this.selected = row;
    this.itemDelete = {
      title: 'ATTENTION',
      content: '<p>Voulez-vous vraiment supprimer ces éléments?</p>',
      cancelLabel: 'Annuler',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/alert.json',
      onConfirm: (data: IConfirmationDialog) => {
        data.loading = true;
        this.isDeleting = true;
        this.table.selected = [];
        this.store.dispatch(HistoryActions.DELETE_REQUESTED({
          input: isBulkDeleted ? this.bulkSelected : [row._id]
        }))
      },
      onCancel: (data: IConfirmationDialog, dialogRef: MatDialogRef<any>) => {
        dialogRef.close();
        this.itemDelete = {} as any;
        this.isDeleting = false;
      },
    }
    this.modalConfirmation.openModal({data: this.itemDelete, disableClose: true});
  }

  openDetail(row: History.Entry) {
    this.modal.open(HistoryDetailComponent, {
      data: row,
      disableClose: false
    })
  }

  onSearch(value: string): void {
    this.rows = this.searchRows.search(value);
    this.searchValue = value;
  }

  onSelect(event: any): void {
    const {selected} = event;
    const elements = [...selected];
    this.bulkSelected = _map(elements, '_id')
  }

  bulkDeleteHistory(): void {
    this.deleteCatalogue({} as History.Entry, true);
  }
}
