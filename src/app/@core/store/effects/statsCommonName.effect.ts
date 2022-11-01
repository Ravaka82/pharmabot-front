import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {StatsCommonNameActions as fromAction} from "../actions";
import { StatsCommonNameService } from "../../services/statsCommonName.service";

@Injectable()
export class StatsCommonNameEffects {

    addCommonName$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED_COMMON_NAME),
    mergeMap(({commonName,dateStart,dateEnd}) => this.service.ResultAddCommonName(commonName,dateStart,dateEnd)
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
    private service: StatsCommonNameService
  ) {
  }
}
