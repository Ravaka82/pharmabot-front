import {createFeatureSelector, createSelector} from "@ngrx/store";
import {PanierState as State} from "../states";
import * as fromReducer from "../reducers/panier.reducer";
import { groupBy } from 'lodash';

export const getRouteState = createFeatureSelector<State>('panier');

export const selectState = createSelector(
  getRouteState,
  (state): State => state
);


export const selectAll = createSelector(
  getRouteState,
  fromReducer.selectAll
);

export const selectEntities = createSelector(
  getRouteState,
  fromReducer.selectEntities
);

export const selectCount = createSelector(
  getRouteState,
  fromReducer.selectTotal
);

export const selectByFournisseur = createSelector(
  selectAll,
  (entries) => groupBy(entries, 'fournisseurName')
)
