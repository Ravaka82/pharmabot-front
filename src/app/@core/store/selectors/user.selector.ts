import {createFeatureSelector, createSelector} from "@ngrx/store";
import {UserState as State} from "../states";
import * as fromReducer from "../reducers/user.reducer";
import {User} from "../../interfaces";
import {CatalogueGroupeSelector} from "./index";

export const getRouteState = createFeatureSelector<State>('user');

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

export const selectUsers = createSelector(
  selectAll,
  CatalogueGroupeSelector.selectEntities,
  (users, catalogueGroupes) => {
    return users.map(user => ({
      ...user,
      catalogueGroupeName: catalogueGroupes[user.catalogueGroupe]?.name || ''
    })) as User.UserPage[];
  }
)

export const selectEntities = createSelector(
  getRouteState,
  fromReducer.selectEntities
)

export const selectSelectedUser = createSelector(
  getRouteState,
  ({selected}): string => selected || ''
)

export const selectedUser = createSelector(
  selectEntities,
  selectSelectedUser,
  (entities, id): User.Entry => {
    return entities[id] || {} as User.Entry;
  }
)
