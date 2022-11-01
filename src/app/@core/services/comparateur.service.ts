import { Injectable } from '@angular/core';
import {EntriesSearch, SET_ITEM_STORAGE} from "../../utils";
import {sortBy as _sortBy, groupBy as _groupBy} from "lodash";
import {CatalogueSettings} from "../interfaces";
import {CatalogueService} from "./catalogue.service";
import {SearchService} from "./search.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ComparateurService {

  isTva = false;
  TVA = 1.2;
  PV = 1.4;
  isRemise = false;
  showPanier = false;

  rows: any = [];
  searchRows!: EntriesSearch<any>
  searchValue = '';
  settings$!: BehaviorSubject<boolean>;

  constructor(private catalogueService: CatalogueService, private searchService: SearchService) {
    this.settings$ = new BehaviorSubject<boolean>(true);
    this.settings$.asObservable();
  }

  computePrixVente(row: any): number {
    const tva = this.isTva ? this.TVA : 1;
    const prix_achat = this.computePrixAchat(row);
    return row.prix_vente = Math.floor(prix_achat * this.PV * tva);
  }

  computePrixAchat(row: any): number {
    const remise = this.isRemise ? (row.remise / 100) : 0;
    const prix_achat_remise = remise * row.prix;
    return row.prix - Math.floor(prix_achat_remise);
  }

  settingChanged(): any[] {
    SET_ITEM_STORAGE('TVA', this.TVA);
    SET_ITEM_STORAGE('PV', this.PV);
    SET_ITEM_STORAGE('show_panier', this.showPanier);
    const rows = [...this.searchRows.search(this.searchValue)];
    this.rows = _sortBy(rows.map(row => {
      return {
        ...row,
        prix_vente: this.computePrixVente(row)
      }
    }), 'prix_vente');
    this.settings$.next(true);
    return this.rows;
  }

  async loadRows(settings: CatalogueSettings.CatalogueSettingsPage[]): Promise<any[]> {
    const fournisseurOptions = _groupBy(settings, 'fournisseurName');
    const queries = settings
      .filter(setting => setting.dateCatalogue)
      .map(setting => {
        return `upload/json/${setting.fournisseur.name}/${setting.dateCatalogue?.replace(/\//g, '-')}.json`
      });

    const rows = await this.catalogueService.loadCatalogue(queries, fournisseurOptions);
    this.searchRows = new EntriesSearch([...rows]).setColumns(['designation']);
    return rows;
  }

  onSearch(value: string): any[] {
    this.searchService.saveSearch(value, this.searchValue);
    this.searchValue = value;
    if (value.length < 2) {
      this.rows = []
    }else if (this.searchRows) {
      this.rows = _sortBy(this.searchRows.search(this.searchValue), 'prix');
    }
    return this.rows;
  }
}
