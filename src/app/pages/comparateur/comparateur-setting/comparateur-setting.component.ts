import {AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, TableColumn} from "@swimlane/ngx-datatable";
import {getTextColor} from "../../../utils";
import {select, Store} from "@ngrx/store";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {filter, map, takeUntil} from "rxjs/operators";
import {AccountSelector, CatalogueSettingsSelector, FournisseurSelector} from "../../../@core/store/selectors";
import {CatalogueSettings, Fournisseur} from "../../../@core/interfaces";
import {CatalogueSettingsActions} from "../../../@core/store/actions";
import {Observable} from "rxjs";

@Component({
  selector: 'app-comparateur-setting',
  templateUrl: './comparateur-setting.component.html',
  styleUrls: ['./comparateur-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComparateurSettingComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  ColumnMode = ColumnMode;
  columns: TableColumn[] = [];
  isModified = false;
  fournisseurs$!: Observable<Fournisseur.Entry[]>;
  catalogueGroupeId: string = '';

  @ViewChild('couleur') couleurTemplate: TemplateRef<any> | any;
  @ViewChild('remise') remiseTemplate: TemplateRef<any> | any;
  @ViewChild('fournisseurTemplate') fournisseurTemplate: TemplateRef<any> | any;
  @ViewChild('action') actionTemplate: TemplateRef<any> | any;

  @Input() rows: CatalogueSettings.CatalogueSettingsPage[] = [];

  constructor(protected store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(AccountSelector.selectState),
      map(userState => userState.catalogueGroupe),
      filter(catalogueGroupeId => !!catalogueGroupeId)
    ).subscribe(catalogueGroupeId => {
      this.catalogueGroupeId = catalogueGroupeId || ''
    })

    this.fournisseurs$ = FournisseurSelector.selectAuthorizedFournisseur$(this.store)
      .pipe(
        takeUntil(super.unsubscribe()),
        filter(fournisseurs => fournisseurs.length > 0)
      );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns =  [
        { prop: 'fournisseur._id', width: 100, name: 'Fournisseur', cellTemplate: this.fournisseurTemplate },
        { prop: 'dateCatalogue', name: 'Catalogue', width: 50},
        { prop: 'remise', name: 'Remise %', width: 50, cellTemplate: this.remiseTemplate },
        { prop: 'couleur', name: 'Couleur', width: 50, cellTemplate: this.couleurTemplate },
        { name: 'Supprimer', width: 110, cellTemplate: this.actionTemplate }
      ];
    })
  }

  fournisseurChange(row: CatalogueSettings.CatalogueSettingsPage, value: string): void {
    this.store.dispatch(CatalogueSettingsActions.UPDATE_REQUESTED({
      id: row._id,
      changes: { fournisseurId: value }
    }));
  }

  couleurChange(row: CatalogueSettings.CatalogueSettingsPage): void {
    this.store.dispatch(CatalogueSettingsActions.UPDATE_REQUESTED({
      id: row._id,
      changes: { couleur: row.couleur }
    }))
    row.couleurText = getTextColor(row.couleur);
  }

  updateRemise(row: CatalogueSettings.CatalogueSettingsPage) {
    this.store.dispatch(CatalogueSettingsActions.UPDATE_REQUESTED({
      id: row._id,
      changes: { remise: row.remise || 0 }
    }));
  }

  deleteFournisseur(row: CatalogueSettings.CatalogueSettingsPage): void {
    this.store.dispatch(CatalogueSettingsActions.DELETE_REQUESTED({
      input: { _id: row._id }
    }))
  }

  addFournisseur(): void {
    this.store.dispatch(CatalogueSettingsActions.CREATE_REQUESTED({
      input: { catalogueGroupeId: this.catalogueGroupeId }
    }))
  }
}
