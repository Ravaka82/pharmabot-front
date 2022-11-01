import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EntriesSearch} from "../../../../utils";
import {ComparateurService} from "../../../../@core/services/comparateur.service";
import {CatalogueSettings} from "../../../../@core/interfaces";
import {takeUntil} from "rxjs/operators";
import {UnsubscribeComponent} from "../../../../shared/component/unsubscribe/unsubscribe.component";

@Component({
  selector: 'app-comparateur-search-mobile',
  templateUrl: './comparateur-search-mobile.component.html',
  styleUrls: ['./comparateur-search-mobile.component.scss']
})
export class ComparateurSearchMobileComponent extends UnsubscribeComponent implements OnInit, OnChanges {

  isDataLoading = false;
  searchRows!: EntriesSearch<any>;
  rows: any = [];
  value = '';

  @Input() selectedTabIndex!: number | null;
  @Input() settings!: CatalogueSettings.CatalogueSettingsPage[];

  constructor(private comparateurService: ComparateurService) {
    super();
  }

  ngOnInit(): void {
    this.comparateurService.settings$.pipe(
      takeUntil(super.unsubscribe())
    ).subscribe(() => {
      this.onSearch(this.value);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.settings?.currentValue) {
      this.isDataLoading = true;
      this.comparateurService
        .loadRows(this.settings)
        .then(rows => {
          this.searchRows = new EntriesSearch([...rows]).setColumns(['designation']);
          this.isDataLoading = false;
        })
    }
  }

  onSearch(value: string): void {
    this.value = value;
    this.rows = this.comparateurService.onSearch(value);
  }

  computePrixVente(row: any): number {
    return this.comparateurService.computePrixVente(row);
  }
}
