
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Archive } from 'src/app/@core/interfaces';
import { ArchiveActions } from 'src/app/@core/store/actions';
import { ArchiveSelector } from 'src/app/@core/store/selectors';
import { ViewChild} from '@angular/core';
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {ColumnMode, DatatableComponent, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import {DatePipe} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {select, Store} from "@ngrx/store";
import {ModalConfirmationService} from "../../@core/services/modal-confirmation.service";
import {takeUntil} from "rxjs/operators";
import {IConfirmationDialog} from "../../@core/interfaces/confirmation-dialog.interface";
import {EntriesSearch} from "../../utils";
import {map as _map} from 'lodash';

@Component({
  selector: 'app-etl',
  templateUrl: './etl.component.html',
  styleUrls: ['./etl.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class EtlComponent extends UnsubscribeComponent implements OnInit {

  dateForm: FormGroup = {} as FormGroup;
  archiveForm: FormGroup = {} as FormGroup;
  loading: boolean = false;
  submitting: boolean = false;
  rows: Archive.Entry[] = [];
  pages: number = 1;
  totallength: any;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  itemDelete!: any;
  columns: TableColumn[] = [];
  isDeleting: boolean = false;
  selected!: Archive.Entry;
  bulkSelected: string[] = [];
  searchRows!: EntriesSearch<any>;
  searchValue: string = '';

  dateRangeChange(dateRange:HTMLInputElement){
    return dateRange.value;
  }
  dateChangeFormat(value:string, format:string){
    return this._datePipe.transform(value, format);
  }
   initDateForm(): void {
    this.dateForm = new FormGroup({
      dateStart: new FormControl('', [Validators.required]),
      dateEnd: new FormControl('', [Validators.required]),
    });
  } 

  @ViewChild('table', {static: true}) table !: DatatableComponent;

  constructor
  (private _datePipe: DatePipe,
   private modalRef: MatDialog,
   private _adapter: DateAdapter<any>,
   protected store: Store,
   private modalConfirmation: ModalConfirmationService,
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  ngOnInit(): void {
    this.initDateForm();
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ArchiveSelector.selectAll)
    ).subscribe(rows => {
      this.rows = rows;
      this.submitting = false;
      this.searchRows = new EntriesSearch([...this.rows]).setColumns(['designation','fournisseur','prix']);
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ArchiveSelector.selectLoading)
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
            content: `Les archives ont été supprimés avec succès`
          }
        });
        this.itemDelete = {};
        this.isDeleting = false;
        this.bulkSelected = [];
        this.rows = this.searchRows.search(this.searchValue);
      }
    });
  }

  deleteCatalogue(row: Archive.Entry, isBulkDeleted: boolean = false) {
    this.selected = row;
    console.log("roww"+ row)
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
        console.log("ppp"+this.bulkSelected)
         this.store.dispatch(ArchiveActions.DELETE_REQUESTED({
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
  onSearch(value: string): void {
    this.rows = this.searchRows.search(value);
    this.searchValue = value;
  }

  onSelect(event: any): void {
    const {selected} = event;
    const elements = [...selected];
    this.bulkSelected = _map(elements,'_id')
  }

  bulkDeleteArchive(): void {
    this.deleteCatalogue({} as Archive.Entry, true);
  }
  submit(){ 
    console.log(this.dateChangeFormat(this.dateForm.get('dateStart')?.value,"MM/dd/yyyy"));
    console.log(this.dateChangeFormat(this.dateForm.get('dateEnd')?.value,"MM/dd/yyyy"));
    const dateStart = this.dateForm.get("dateStart")?.value;
    const dateEnd = this.dateForm.get("dateEnd")?.value;
    this.submitting = true;
    this.store.dispatch(ArchiveActions.LOAD_REQUESTED({
      dateStart,dateEnd
    }))
  }
}

