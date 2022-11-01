import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ClientState as State} from "../states";
import * as fromReducer from "../reducers/client.reducer";

export const getRouteState = createFeatureSelector<State>('client');

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

export const selectClientById = (id: string) => createSelector(
  selectEntities,
  (entities) => entities && entities[id]
)
