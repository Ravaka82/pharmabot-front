import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import { ProductRefsService } from "../../services/product-refs.service";
import {HistoryActions, ProductRefsActions as fromAction} from "../actions";
import { GET_ITEM_STORAGE } from "src/app/utils";

@Injectable()
export class ProductRefsEffects {

  createHistory$ = createEffect(() => this.actions$.pipe(
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

  getProductTRefs$ = createEffect(() => this.actions$.pipe(
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
  deleteProduct$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input: { _id } }) => this.service.delete(_id)
      .pipe(
        mergeMap(response => {
          console.log(response)
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'DELETE',
                description: `Le nom commun : '${response.refsMap.name}' a été supprimé.`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input: _id,
                  output: response
                }
              }]}),
            fromAction.DELETE_SUCCEED({entry: response})
          ]
        }),
      ))
  ));

  constructor(
    private actions$: Actions,
    private service: ProductRefsService
  ) {
  }
}
