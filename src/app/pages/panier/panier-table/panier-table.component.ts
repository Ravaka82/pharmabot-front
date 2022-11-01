import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, TableColumn} from "@swimlane/ngx-datatable";
import {BehaviorSubject, combineLatest} from "rxjs";
import {Panier} from "../../../@core/interfaces";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {Store} from "@ngrx/store";
import {PanierSelector} from "../../../@core/store/selectors";
import {filter, map, takeUntil, tap} from "rxjs/operators";
import {flatten} from 'lodash';
import {EntriesSearch} from "../../../utils";
import {PanierActions} from "../../../@core/store/actions";
import {IConfirmationDialog} from "../../../@core/interfaces/confirmation-dialog.interface";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalConfirmationService} from "../../../@core/services/modal-confirmation.service";
import {ExportExcelService} from "../../../@core/services/export-excel.service";
import {PanierDetailComponent } from '../panier-detail/panier-detail.component';
import {PanierUploadComponent} from '../panier-upload/panier-upload.component';



const SHOW_ALL = 'AFFICHER_TOUT';

@Component({
  selector: 'app-panier-table',
  templateUrl: './panier-table.component.html',
  styleUrls: ['./panier-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanierTableComponent extends UnsubscribeComponent implements OnInit {
  
  rows!: Panier.Entry[];
  allRows: Panier.Entry[] = [];
  searchRows!: EntriesSearch<Panier.Entry>;
  ColumnMode = ColumnMode;
  columns: TableColumn[] = [];
  rowTotal = {
    label: 'Total',
    prix: 0
  };
  Email : any;

  selectedFournisseur$: BehaviorSubject<number> = new BehaviorSubject(0);
  fournisseurEntries: { key: string, view: string }[] = []

  @ViewChild('prixTpl', {static: true}) prixTemplate!: TemplateRef<any>
  @ViewChild('totalTpl', {static: true}) totalTemplate!: TemplateRef<any>
  @ViewChild('quantityTpl', {static: true}) quantityTemplate!: TemplateRef<any>

  constructor( private dialog: MatDialog,protected store: Store, private modalConfirmation: ModalConfirmationService, private exportExcelService: ExportExcelService) {
    super();
  }

  ngOnInit(): void {
    this.columns = [
      { name: 'fournisseur', prop: 'fournisseurName',  flexGrow: 25 },
      { name: 'designation', prop: 'designation',  flexGrow: 80},
      { name: 'date_Expiration', prop: 'date_expiration',  flexGrow: 25 },
      { name: 'quantité',  flexGrow: 20, cellTemplate: this.quantityTemplate },
      { name: 'prix (Ar)', flexGrow: 20, cellTemplate: this.prixTemplate },
      { name: 'Total (Ar)',  flexGrow: 20, cellTemplate: this.totalTemplate},
    ];

    combineLatest([
      this.selectedFournisseur$,
      this.store.select(PanierSelector.selectByFournisseur),
    ]).pipe(
      takeUntil(super.unsubscribe()),
      filter(([__, entries]) => !!entries),
      map(([selectedFournisseurIndex, entries]) => {
        const allRows = flatten(Object.values(entries));
        const fournisseurs: string[] = Object.keys(entries) || [];
        this.fournisseurEntries = fournisseurs.map(fournisseur => {
          return {
            key: fournisseur,
            view: fournisseur
          }
        });
        this.fournisseurEntries.unshift({
          key: SHOW_ALL,
          view: 'AFFICHER TOUT'
        });

        this.allRows = allRows;
        const selectedFournisseur: string = this.fournisseurEntries[selectedFournisseurIndex || 0]?.key || 'AFFICHER_TOUT';
        if (selectedFournisseur === SHOW_ALL) {
          return allRows
        }
        return entries[selectedFournisseur] || []
      }),
      tap((rows) => {
        this.rowTotal.prix = rows.reduce((prev, next) => {
          return prev + (next.cart_total || 0)
        }, 0)
      })
    ).subscribe(rows => {
      this.searchRows = new EntriesSearch([...rows]).setColumns(['designation']);
      this.rows = [...rows];
    })
  }

  onSearch(keyword: string): void {
    this.rows = [...this.searchRows.search(keyword)];
  }

  removeFournisseur(index: number): void {
    const fournisseurName = this.fournisseurEntries[index]?.key;
    const ids = this.allRows
      .filter(row => row.fournisseurName === fournisseurName)
      .map(row => row.id) || [];
    this.store.dispatch(PanierActions.REMOVE_ITEM({ ids: (ids as string[]) ?? [] }))
  }

  upsertItemCart(row: any, cart_count: string): void {
    this.store.dispatch(PanierActions.PUSH_OR_UPDATE({
      entry: {
        ...row,
        cart_count: Number(cart_count),
        cart_total: Number(cart_count) * row.prix,
      }
    }))
  }

  removeItemCart(row: any): void {
    const id = `${row.fournisseurId}#${row.designation}`;
    this.store.dispatch(PanierActions.REMOVE_ITEM({ ids: [id] }));
  }

  dropCart(): void {
    const dropCartDialog = {
      title: 'ATTENTION',
      content: '<p>Voulez-vous vraiment vider votre panier?</p>',
      cancelLabel: 'Annuler',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/alert.json',
      onConfirm: (data: IConfirmationDialog, dialogRef: MatDialogRef<any>) => {
        const ids = this.rows.map(row => `${row.fournisseurId}#${row.designation}`);
        this.store.dispatch(PanierActions.REMOVE_ITEM({ ids }));
        dialogRef.close();
      },
      onCancel: (data: IConfirmationDialog, dialogRef: MatDialogRef<any>) => {
        dialogRef.close();
      },
    }
    this.modalConfirmation.openModal({data: dropCartDialog, disableClose: true});
  }
  
  openDetail(): void {
    this.dialog.open(PanierDetailComponent, {
      data: this.rows,
      width: '600px'
    })
  }

  exportExcel(): void {
    this.exportExcelService.export(this.rows);
  }
  upload(): void{
    this.dialog.open(PanierUploadComponent, {
      data: this.rows,
      width: '600px'
    })
  }
}
