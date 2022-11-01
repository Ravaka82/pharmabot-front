import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {FactureActions as fromAction, HistoryActions} from "../actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {FactureService} from "../../services/facture.service";
import {GET_ITEM_STORAGE} from "../../../utils";

@Injectable()
export class FactureEffects {

  factures$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(({query}) => this.service.get(query)
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

  createFacture$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.add(input)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'CREATE',
                description: `Une nouvelle facture '${response.reference}' a été créé.`,
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

  updateFacture$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.UPDATE_REQUESTED),
    mergeMap(({id, changes}) => this.service.update(id, changes)
      .pipe(
        mergeMap(response => {
          const entry: any = {...response, ...changes}
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'UPDATE',
                description: `La facture '${response.reference}' a été mis à jour.`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input: {id, changes},
                  output: response
                }
              }]}),
            fromAction.UPDATE_SUCCEED({entry})
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

  deleteFacture$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input: { _id } }) => this.service.delete(_id)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'DELETE',
                description: `La facture '${response.reference}' a été supprimé.`,
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
    private service: FactureService
  ) {
  }
}
