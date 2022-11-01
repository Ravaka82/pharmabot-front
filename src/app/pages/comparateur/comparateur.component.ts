import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {filter, takeUntil} from "rxjs/operators";
import {CatalogueSettingsSelector} from "../../@core/store/selectors";
import {Observable} from "rxjs";
import {CatalogueSettings} from "../../@core/interfaces";
import {UiService} from "../../@core/services/ui.service";

@Component({
  selector: 'app-comparateur',
  templateUrl: './comparateur.component.html',
  styleUrls: ['./comparateur.component.scss']
})
export class ComparateurComponent extends UnsubscribeComponent implements OnInit {

  loading: boolean = false;
  searchValue: string = '';
  comparateurSettings$!: Observable<CatalogueSettings.CatalogueSettingsPage[]>
  selectedIndex = 0;
  rows: any[] = []
  isMobile$ !: Observable<boolean>;

  constructor(protected store: Store, private uiService: UiService) {
    super();
  }

  ngOnInit(): void {
    this.isMobile$ = this.uiService.isMobileView$.pipe(takeUntil(super.unsubscribe()));

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueSettingsSelector.selectLoading)
    ).subscribe(loading => this.loading = loading);

    this.comparateurSettings$ = CatalogueSettingsSelector.selectPage$(this.store).pipe(
      takeUntil(super.unsubscribe()),
      filter(rows => rows.length >0)
    )
  }
}
