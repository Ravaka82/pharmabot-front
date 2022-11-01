import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HistoryActions as fromAction} from "../actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {HistoryService} from "../../services/history.service";

@Injectable()
export class HistoryEffects {

  catalogueGroupe$ = createEffect(() => this.actions$.pipe(
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

  createHistory$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.add(input)
      .pipe(
        map(response => {
          return fromAction.CREATE_SUCCEED({entry: response});
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.CREATE_FAILED({error: {
              errorMessage: error.message,
              action: 'CREATE'
            }}))
        })
      ))
  ));

  deleteHistory$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input }) => this.service.delete(input)
      .pipe(
        map(response => {
          return fromAction.DELETE_SUCCEED({ids: input});
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
    private service: HistoryService
  ) {
  }
}
