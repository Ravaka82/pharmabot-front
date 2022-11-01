import {createFeatureSelector, createSelector} from "@ngrx/store";
import {RoleState as State} from "../states";
import * as fromReducer from "../reducers/role.reducer";
import {Role} from "../../interfaces";

export const getRouteState = createFeatureSelector<State>('role');

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

export const selectSelectedRole = createSelector(
  getRouteState,
  ({selected}): string => selected || ''
)

export const selectedRole = createSelector(
  selectEntities,
  selectSelectedRole,
  (entities, id): Role.Entry => {
    return entities[id] || {} as Role.Entry;
  }
)

export const selectRoleWithPageCount = createSelector(
  selectAll,
  (entities): Role.RolePage[] => {
    return entities.map(entity => {
      return {
        id: entity._id,
        label: entity.name,
        pageCount: entity.pages.length
      }
    })
  }
)
