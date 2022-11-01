import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import { SearchService } from "../../services/search.service";
import {SearchActions as fromAction} from "../actions";

@Injectable()
export class SearchEffects {
 
    countOccurence$ = createEffect(() => this.actions$.pipe(
        ofType(fromAction.LOAD_REQUESTED),
        mergeMap(() => this.service.countOccurence()
          .pipe(
            map(response => {
              console.log(fromAction.LOAD_REQUESTED);
              return fromAction.LOAD_SUCCEED({entries: response});
            }),
            catchError((error: ApolloError) => {
              return of(fromAction.LOAD_FAILED({error: {
                  errorMessage: error.message,
                }}))
            })
          ))
      ));

  constructor(
    private actions$: Actions,
    private service: SearchService
  ) {
  }
}
