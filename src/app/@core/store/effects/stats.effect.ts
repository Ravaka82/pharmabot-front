import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {StatsActions as fromAction, HistoryActions} from "../actions";
import { StatsService } from "../../services/stats.service";

@Injectable()
export class StatsEffects {

  addOneDesignation$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED_DESIGNATION),
    mergeMap(({designation,dateStart,dateEnd}) => this.service.ResultAddDesignation(designation,dateStart,dateEnd)
      .pipe(
        map(response => {
          return fromAction.LOAD_SUCCEED({entries: response})    
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
    private service: StatsService
  ) {
  }
}
