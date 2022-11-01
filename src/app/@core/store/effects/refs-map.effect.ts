import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import { RefsMapService } from "../../services/refs-map.service";
import {RefsMapActions as fromAction} from "../actions";

@Injectable()
export class RefsMapEffects {

  createRefsMap$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.create(input)
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

  getRefsMap$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(() => this.service.get()
      .pipe(
        map(response => {
          console.log(fromAction.LOAD_REQUESTED);
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


  
  constructor(
    private actions$: Actions,
    private service: RefsMapService
  ) {
  }
}
