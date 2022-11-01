import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {MapService } from "../../services/map.service";
import {MapActions as fromAction} from "../actions";

@Injectable()
export class MapEffects{
  addOneFournisseur$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(({addOneFournisseurId}) => this.service.addOneFournisseur(addOneFournisseurId)
      .pipe(
        map(response => {
          //   console.log("ddd");
          // console.log(response);
          return fromAction.LOAD_SUCCEED({entry: response})    
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
    private service: MapService
  ) {
  }
}
