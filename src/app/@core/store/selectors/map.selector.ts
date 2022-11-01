import {createFeatureSelector, createSelector} from "@ngrx/store";
import {MapState as State} from "../states";
import * as fromReducer from "../reducers/map.reducer";

export const getRouteState = createFeatureSelector<State>('map');

export const selectState = createSelector(
  getRouteState,
  (state): State => state
);

export const selectLoading = createSelector(
  getRouteState,
  ({loading}): boolean => loading
);
export const selectById = (id: string) => createSelector(
  selectEntities,
  (entities) => entities && entities[id]
);
export const selectAll = createSelector(
  getRouteState,
  fromReducer.selectAll
);
export const selectEntities = createSelector(
  getRouteState,
  fromReducer.selectEntities
);

  