import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CatalogueState as State} from "../states";
import * as fromReducer from "../reducers/catalogue.reducer";
import {groupBy as _groupBy} from 'lodash';
import * as moment from 'moment';

export const getRouteState = createFeatureSelector<State>('catalogue');

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

export const selectLatestCatalogue = createSelector(
  selectAll,
  (catalogues) => {
    const catalogueByFournisseur = _groupBy(catalogues, 'fournisseur');
    const latestCatalogues: any = {};
    for(const [fournisseur, entry] of Object.entries(catalogueByFournisseur)) {
      const latestDateCatalogue = entry
        .map(e => moment(e.catalogue, 'DD/MM/YYYY'))
        .reduce((a, b) => a.isBefore(b) ? b : a)
        .format('DD/MM/YYYY');

      const lastCatalogue = entry.find(e => e.catalogue === latestDateCatalogue);
        latestCatalogues[fournisseur] = {
          extension: lastCatalogue?.extension ,
          catalogue: latestDateCatalogue,
          updatedAt: lastCatalogue?.updatedAt
        }
    }
    return latestCatalogues;
  }
)
