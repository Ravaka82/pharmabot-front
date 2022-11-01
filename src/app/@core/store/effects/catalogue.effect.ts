import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CatalogueActions as fromAction, CatalogueImportActions, HistoryActions} from "../actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {CatalogueService} from "../../services/catalogue.service";
import {GET_ITEM_STORAGE} from "../../../utils";

@Injectable()
export class CatalogueEffects {

  catalogue$ = createEffect(() => this.actions$.pipe(
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

  createCatalogue$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.uploadCatalogue(input)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'CREATE',
                description: `Un catalogue de ${input.date_catalogue} - ${input.fournisseur} a été ajouté.`,
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

  deleteCatalogue$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input: { _id } }) => this.service.delete(_id)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'DELETE',
                description: `Le catalogue ${response.catalogue} de ${response.fournisseur} a été supprimé.`,
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
    private service: CatalogueService
  ) {
  }
}
