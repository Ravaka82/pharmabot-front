import {createFeatureSelector, createSelector} from "@ngrx/store";
import {FactureState as State} from "../states";
import * as fromReducer from "../reducers/facture.reducer";

export const getRouteState = createFeatureSelector<State>('facture');

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
