import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {FournisseurActions as fromAction, HistoryActions} from "../actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {FournisseurService} from "../../services/fournisseur.service";
import {GET_ITEM_STORAGE} from "../../../utils";

@Injectable()
export class FournisseurEffects {

  fournisseur$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(() => this.service.get()
      .pipe(
        map(response => {
          return fromAction.LOAD_SUCCEED({entries: response});
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.LOAD_FAILED({error: {
              errorMessage: error.message,
              action: 'LOAD'
            }}))
        })
      ))
  ));

  createFournisseur$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.add(input)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'CREATE',
                description: `Un nouveau fournisseur '${input.name}' a été créé.`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input,
                  output: response
                }
              }]}),
            fromAction.CREATE_SUCCEED({entry: response})
          ]
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.CREATE_FAILED({error: {
              errorMessage: error.message,
              action: 'CREATE'
            }}))
        })
      ))
  ));

  updateFournisseur$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.UPDATE_REQUESTED),
    mergeMap(({id, changes}) => this.service.update(id, changes)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'UPDATE',
                description: `Le nom du fournisseur '${response.name}' a été mis à jour en "${changes.name}".`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input: {id, changes},
                  output: response
                }
              }]}),
            fromAction.UPDATE_SUCCEED({entry: {...response, ...changes}})
          ]
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.UPDATE_FAILED({error: {
              errorMessage: error.message,
              action: 'UPDATE'
            }}))
        })
      ))
  ));

  deleteFournisseur$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input: { _id } }) => this.service.delete(_id)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'DELETE',
                description: `Le fournisseur '${response.name}' a été supprimé.`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input: _id,
                  output: response
                }
              }]}),
            fromAction.DELETE_SUCCEED({entry: response})
          ]
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.DELETE_FAILED({error: {
              errorMessage: error.message,
              action: 'DELETE'
            }}))
        })
      ))
  ));

  constructor(
    private actions$: Actions,
    private service: FournisseurService
  ) {
  }
}
