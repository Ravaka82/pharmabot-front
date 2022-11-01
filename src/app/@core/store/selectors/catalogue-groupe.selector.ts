import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {CatalogueGroupeState as State} from "../states";
import * as fromReducer from "../reducers/catalogue-groupe.reducer";
import {CatalogueGroupe} from "../../interfaces";
import {FournisseurSelector, UserSelector} from "./index";
import {groupBy as _groupBy} from 'lodash';
import {combineLatest} from "rxjs";
import {filter, map} from "rxjs/operators";

export const getRouteState = createFeatureSelector<State>('catalogue-groupe');

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

export const selectSelectedCatalogueGroupe = createSelector(
  getRouteState,
  ({selected}): string => selected || ''
)

export const selectedCatalogueGroupe = createSelector(
  selectEntities,
  selectSelectedCatalogueGroupe,
  (entities, id): CatalogueGroupe.Entry => {
    return entities[id] || {} as CatalogueGroupe.Entry;
  }
)

export const selectCatalogueGroupeWithPageCount$ = (store: Store) => (
  combineLatest([
    store.select(FournisseurSelector.selectIds),
    store.select(UserSelector.selectUsers),
    store.select(selectAll)
  ]).pipe(
    filter(([fournisseursId, users, entities]) =>
      !!fournisseursId && !!users && !!entities
    ),
    map(([fournisseurIds, users, entities]): CatalogueGroupe.CatalogueGroupePage[] => {
        return entities
          .map(entity => {
            const catalogueGroupeUserById = _groupBy(users, 'catalogueGroupe');
            const userCount = catalogueGroupeUserById[entity._id]?.length;
            const catalogueCount = entity.fournisseurs.filter(
              fournisseurId => (fournisseurIds as string[]).indexOf(fournisseurId) > -1
            ).length;

            return {
              id: entity._id,
              name: entity.name,
              active: entity.active,
              catalogueCount,
              userCount
            }
          })
      }
    )
  )
)
