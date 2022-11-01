import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ColumnMode, TableColumn} from "@swimlane/ngx-datatable";
import {EntriesSearch, GET_ITEM_STORAGE, SET_ITEM_STORAGE} from "../../../utils";
import {CatalogueSettings} from "../../../@core/interfaces";
import {CatalogueService} from "../../../@core/services/catalogue.service";
import {SearchService} from "../../../@core/services/search.service";
import {ComparateurService} from "../../../@core/services/comparateur.service";
import {Panier} from '../../../@core/interfaces';
import {Store} from "@ngrx/store";
import {PanierActions} from "../../../@core/store/actions";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {PanierSelector} from "../../../@core/store/selectors";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-comparateur-search',
  templateUrl: './comparateur-search.component.html',
  styleUrls: ['./comparateur-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComparateurSearchComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  ColumnMode = ColumnMode;
  searchRows!: EntriesSearch<any>
  rows: any = [];
  initialRows: any[] = [];
  isTva = false;
  TVA = 1.2;
  PV = 1.4;
  isRemise = false;
  showPanier = false;
  columns: TableColumn[] = [];
  isDataLoading = false;
  searchValue = '';
  cartById: { [id: string]: Panier.Entry } = {};

  @ViewChild('paTpl', {static: true}) paTemplate!: TemplateRef<any>
  @ViewChild('frsTpl', {static: true}) frsTemplate!: TemplateRef<any>
  @ViewChild('pvTpl', {static: true}) pvTemplate!: TemplateRef<any>
  @ViewChild('designationTpl', {static: true}) designationTemplate!: TemplateRef<any>

  @Input() set search(value: string) {
    this.rows = this.comparateurService.onSearch(value);
    this.rows = this.rows.map((row: any) => {
      return {
        ...row,
        cart_added: this.cartById && !!this.cartById[row.cart_id],
        cart_count: this.cartById && this.cartById[row.cart_id]?.cart_count
      };
    });
  }

  @Input() settings: CatalogueSettings.CatalogueSettingsPage[] = [];
  @Input() set selectedIndex(value: number) {
    if (value === 1) {
      this.searchValue = '';
      setTimeout(() => {
        if (this.searchRows) {
          this.rows = []
        }
      })
    }
  }

  constructor(
    private catalogueService: CatalogueService,
    private searchService: SearchService,
    private comparateurService: ComparateurService,
    protected store: Store
  ) { super() }

  ngOnInit(): void {
    this.store.select(PanierSelector.selectEntities).pipe(
      takeUntil(super.unsubscribe())
    ).subscribe(carts => {
      Object.assign(this.cartById, carts);
    })

    this.TVA = GET_ITEM_STORAGE('TVA') || this.TVA;
    this.PV = GET_ITEM_STORAGE('PV') || this.PV;
    this.showPanier = GET_ITEM_STORAGE('show_panier') || this.showPanier;
    this.columns =  [
      { cellTemplate: this.designationTemplate, flexGrow: 100, name: 'Désignation'},
      { cellTemplate: this.paTemplate, name: 'PA (Ar)', prop: 'prix', flexGrow: 20},
      { prop: 'date_expiration', name: 'Expiration', flexGrow: 20 },
      { prop: 'tva', name: 'TVA', flexGrow: 20},
      { cellTemplate: this.frsTemplate, name: 'Fournisseur', flexGrow: 30 },
      { cellTemplate: this.pvTemplate, name: 'PV (Ar)', prop: 'prix_vente', flexGrow: 20 },
    ];
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges?.settings?.currentValue) {
      this.isDataLoading = true;
      this.comparateurService
        .loadRows(this.settings)
        .then(rows => {
          this.searchRows = new EntriesSearch([...rows]).setColumns(['designation']);
          this.isDataLoading = false;
        })
    }
  }

  computePrixVente(row: any): number {
    return this.comparateurService.computePrixVente(row);
  }

  computePrixAchat(row: any): number {
    return this.comparateurService.computePrixAchat(row);
  }

  toolbarMenuValueChanged(): void {
    this.comparateurService.PV = this.PV;
    this.comparateurService.TVA = this.TVA;
    this.comparateurService.isTva = this.isTva;
    this.comparateurService.isRemise = this.isRemise;
    this.comparateurService.showPanier = this.showPanier;
    this.rows = this.comparateurService.settingChanged();
  }

  upsertItemCart(row: any, cart_count: string): void {
    row.cart_count = Number(cart_count);
    row.cart_added = true;
    this.store.dispatch(PanierActions.PUSH_OR_UPDATE({
      entry: {
        id: row.cart_id,
        clientId: GET_ITEM_STORAGE('currentUserId'),
        cart_count: Number(cart_count),
        cart_total: Number(cart_count) * row.prix,
        designation: row.designation,
        fournisseurName: row.fournisseur,
        fournisseurId: row.fournisseurId,
        date_expiration: row.date_expiration,
        prix: row.prix
      }
    }))
  }

  removeItemCart(row: any): void {
    row.cart_added = false;
    row.cart_count = 1;
    this.store.dispatch(PanierActions.REMOVE_ITEM({ids: [row.cart_id]}));
  }
}

