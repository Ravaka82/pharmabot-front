import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ArchiveState as State} from "../states";
import * as fromReducer from "../reducers/archive.reducer";
import {sortBy as _sortBy} from 'lodash';
import {groupBy as _groupBy} from 'lodash';

export const getRouteState = createFeatureSelector<State>('archive');

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

