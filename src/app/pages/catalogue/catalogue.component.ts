import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColumnMode, DatatableComponent, TableColumn} from "@swimlane/ngx-datatable";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {Store} from "@ngrx/store";
import {FournisseurSelector} from "../../@core/store/selectors";
import {takeUntil} from "rxjs/operators";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {EntriesSearch} from "../../utils";
import {sortBy as _sortBy} from "lodash";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {UiService} from "../../@core/services/ui.service";
import {Fournisseur} from "../../@core/interfaces";

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent extends UnsubscribeComponent implements OnInit{
  ColumnMode = ColumnMode;
  rows: Fournisseur.Entry[] = [];
  columns: TableColumn[] = [];
  searchRows!: EntriesSearch<any>
  isMobile$ !: Observable<boolean>;

  @ViewChild('table', {static: true}) table: DatatableComponent | undefined;
  @ViewChild('importTpl', {static: true}) importTpl: TemplateRef<any> | undefined;

  constructor(
    private _datePipe: DatePipe,
    private modalRef: MatDialog,
    private _adapter: DateAdapter<any>,
    protected store: Store,
    private router: Router,
    private uiService: UiService
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  ngOnInit(): void {
    this.isMobile$ = this.uiService.isMobileView$.pipe(takeUntil(super.unsubscribe()));
    FournisseurSelector.selectAuthorizedFournisseur$(this.store)
      .pipe(takeUntil(super.unsubscribe()))
      .subscribe(fournisseurs => {
        this.rows = fournisseurs && [...fournisseurs];
        this.searchRows = new EntriesSearch([...this.rows]).setColumns(['name']);
      })
    this.columns = [
      { prop: 'name', name: 'Fournisseur' },
      { prop: 'dateCatalogue', name: 'Date du catalogue' },
      { prop: 'updatedAt', name: 'Dernière importation', pipe: this.datePipe('dd MMM YYYY - HH:mm') },
      { name: 'Mettre à jour', cellTemplate: this.importTpl }
    ];
  }

  datePipe (format: string) {
    return {
      transform: (value: any) => this._datePipe.transform(value, format)};
  }

  openImportCatalogue(fournisseur: string): void {
    // this.modalRef.open(CatalogueImportComponent, {
    //   disableClose: true,
    //   data: {
    //     fournisseur,
    //     user: this.user
    //   },
    //   autoFocus: false,
    //   position: {
    //     top: "4em"
    //   },
    //   maxWidth: '70vw'
    // })
    this.router.navigateByUrl(`/catalogue/${fournisseur}`);
  }

  onSearch(value: string): void {
    this.rows = _sortBy(this.searchRows.search(value), 'name');
  }
}
