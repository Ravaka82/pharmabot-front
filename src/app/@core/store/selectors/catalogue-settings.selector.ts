import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {CatalogueSettingsState as State} from "../states";
import * as fromReducer from "../reducers/catalogue-settings.reducer";
import {CatalogueSelector, FournisseurSelector} from "./index";
import {CatalogueSettings} from "../../interfaces";
import {getTextColor} from "../../../utils";
import {get as _get, isEmpty as _isEmpty} from 'lodash';
import {combineLatest} from "rxjs";
import {filter, map} from "rxjs/operators";

export const getRouteState = createFeatureSelector<State>('catalogue-settings');

export const selectState = createSelector(
  getRouteState,
  (state): State => state
);

export const selectLoading = createSelector(
  getRouteState,
  ({loading}): boolean => loading
);

export const selectAll = createSelector(
  getRouteState,
  fromReducer.selectAll
)

export const selectEntities = createSelector(
  getRouteState,
  fromReducer.selectEntities
)

export const selectPage$ = (store: Store) => {
  return combineLatest([
    store.select(selectAll),
    store.select(FournisseurSelector.selectEntities),
    store.select(CatalogueSelector.selectLatestCatalogue)
  ]).pipe(
    filter(([entities, fournisseurs, catalogues]) => !_isEmpty(entities) && !_isEmpty(fournisseurs) && !_isEmpty(catalogues)),
    map(([settings, fournisseurEntities, fournisseurMap]) => {
      return settings.map((setting: any) => {
        return {
          ...setting,
          couleurText: setting.couleur && getTextColor(setting.couleur),
          fournisseur: fournisseurEntities[setting.fournisseurId] || {},
          fournisseurName: _get(fournisseurEntities, [setting.fournisseurId, 'name'], ''),
          dateCatalogue: _get(fournisseurMap, [fournisseurEntities[setting.fournisseurId]?.name || '', 'catalogue'], '')
        } as CatalogueSettings.CatalogueSettingsPage
      }) as CatalogueSettings.CatalogueSettingsPage[]
    })
  );
}
