import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {StatsCommonNameState as State} from "../states";
import * as fromReducer from "../reducers/stats.reducer";
import {sortBy as _sortBy} from 'lodash';
import {groupBy as _groupBy} from 'lodash';

export const getRouteState = createFeatureSelector<State>('statsCommonName');

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