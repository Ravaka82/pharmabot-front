import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import { SearchGraphService } from "../../services/search-graph.service";
import {SearchGraphActions as fromAction} from "../actions";

@Injectable()
export class SearchGraphEffects {

  addOccurenceByMonth$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(({month,nombre}) => this.service.addOccurenceByMonth(month,nombre)
      .pipe(
        map(response => {
          console.log(fromAction.LOAD_REQUESTED);
          return fromAction.LOAD_SUCCEED({entries: response})    
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
    private service: SearchGraphService
  ) {
  }
}
