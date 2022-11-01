import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {FournisseurState as State} from "../states";
import * as fromReducer from "../reducers/fournisseur.reducer";
import {combineLatest} from "rxjs";
import {AccountSelector, CatalogueGroupeSelector, CatalogueSelector, FournisseurSelector, UserSelector} from "./index";
import {filter, map} from "rxjs/operators";
import {Fournisseur} from "../../interfaces";
import {sortBy as _sortBy} from 'lodash';

export const getRouteState = createFeatureSelector<State>('fournisseur');

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

export const selectIds = createSelector(
  getRouteState,
  fromReducer.selectIds
)

export const selectAuthorizedFournisseur$ = (store: Store) => {
  return combineLatest([
    store.select(CatalogueGroupeSelector.selectAll),
    store.select(FournisseurSelector.selectEntities),
    store.select(UserSelector.selectUsers),
    store.select(AccountSelector.selectState),
    store.select(CatalogueSelector.selectLatestCatalogue)
  ]).pipe(
    filter(([catalogueGroupes, fournisseurEntities, users, userState]) =>
      !!catalogueGroupes && !!fournisseurEntities && !!users && !!userState
    ),
    map(([catalogueGroupes, fournisseurEntities, users, userState, latestCatalogue]) => {
      const currentUser = users.find(user => user._id === userState._id);
      const catalogueGroupe = catalogueGroupes.find(catalogue => catalogue._id === currentUser?.catalogueGroupe);
      const fournisseurs = catalogueGroupe?.fournisseurs.map((fournisseurId: any) => {
        const entry = fournisseurEntities[fournisseurId];
        return {
          ...entry,
          updatedAt: latestCatalogue[entry?.name || '']?.updatedAt,
          dateCatalogue: latestCatalogue[entry?.name || '']?.catalogue
        }
      });
      return _sortBy(fournisseurs, 'name', 'desc') as Fournisseur.Entry[];
    })
  )
}
