import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColumnMode, DatatableComponent, TableColumn} from "@swimlane/ngx-datatable";
import {DatePipe} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {CatalogueSelector} from "../../@core/store/selectors";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {Catalogue} from '../../@core/interfaces';
import {IConfirmationDialog} from "../../@core/interfaces/confirmation-dialog.interface";
import {CatalogueActions} from "../../@core/store/actions";
import {ModalConfirmationService} from "../../@core/services/modal-confirmation.service";
import {environment} from "../../../environments/environment";
import {sortBy as _sortBy} from "lodash";
import {EntriesSearch} from "../../utils";

@Component({
  selector: 'app-gestion-catalogue',
  templateUrl: './gestion-catalogue.component.html',
  styleUrls: ['./gestion-catalogue.component.scss']
})
export class GestionCatalogueComponent extends UnsubscribeComponent implements OnInit {

  ColumnMode = ColumnMode;
  rows: Catalogue.Entry[] = [];
  itemDelete!: any;
  columns: TableColumn[] = [];
  loading: boolean = false;
  isDeleting: boolean = false;
  selected!: Catalogue.Entry;
  SERVER_URL = environment.SERVER_URL;
  searchRows!: EntriesSearch<any>

  @ViewChild('table', {static: true}) table: DatatableComponent | undefined;
  @ViewChild('catalogueTpl', {static: true}) catalogueTpl: TemplateRef<any> | undefined;
  @ViewChild('downloadTpl', {static: true}) downloadTpl: TemplateRef<any> | undefined;
  @ViewChild('deleteTpl', {static: true}) deleteTpl: TemplateRef<any> | undefined;

  constructor
  (private _datePipe: DatePipe,
   private modalRef: MatDialog,
   private _adapter: DateAdapter<any>,
   protected store: Store,
   private modalConfirmation: ModalConfirmationService
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueSelector.selectAll)
    ).subscribe(rows => {
      this.rows = rows;
      this.searchRows = new EntriesSearch([...this.rows]).setColumns(['fournisseur']);
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueSelector.selectLoading)
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
            content: `Le catalogue <b>${this.selected?.fournisseur} - ${this.selected?.catalogue}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.isDeleting = false;
      }
    });

    this.columns = [
      { name: 'Fournisseur', prop: 'fournisseur', width: 100 },
      { name: 'Catalogue', cellTemplate: this.catalogueTpl, width: 40 },
      { name: 'Date importation', prop: 'createdAt', pipe: this.datePipe('dd/MM/yyyy HH:mm'), width: 75 },
      { name: 'Fichier', cellTemplate: this.downloadTpl },
      { name: 'Supprimer', cellTemplate: this.deleteTpl }
    ];
  }

  downloadFile(row: Catalogue.Entry, filetype: 'json' | 'original'): void {
    const url = `${row.fournisseur}/${row.catalogue.replace(/\//g, '-')}.${ filetype === 'original' ? row.extension : filetype}`;
    window.open(`${this.SERVER_URL}/upload/${filetype}/${url}`, '_blank');
  }

  datePipe (format: string) {
    return {
      transform: (value: any) => this._datePipe.transform(value, format)};
  }

  deleteCatalogue(row: Catalogue.Entry) {
    this.selected = row;
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
        this.store.dispatch(CatalogueActions.DELETE_REQUESTED({
          input: { _id: row._id }
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
    this.rows = _sortBy(this.searchRows.search(value), 'name');
  }

}
