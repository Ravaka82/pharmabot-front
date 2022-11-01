import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import { ArchiveService } from "../../services/archive.service";
import {ArchiveActions as fromAction, HistoryActions} from "../actions";
import { entries } from "lodash";
import { GET_ITEM_STORAGE } from "src/app/utils";

@Injectable()
export class ArchiveEffects {

  addJsonCatalogue$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(({dateStart, dateEnd}) => this.service.addJsonCatalogue(dateStart, dateEnd)
      .pipe(
        map(response => {
          console.log(fromAction.LOAD_REQUESTED);
          // console.log(fromAction.LOAD_SUCCEED({entries: response}))
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
  createArchive$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.add(input)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'CREATE',
                description: `Un nouveau archive '${response.designation}' a été créé.`,
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
  deleteArchiveById$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input }) => this.service.deleteArchive(input)
      .pipe(
        map(response => {
          return fromAction.DELETE_SUCCEED({input: input});
        }),
        // catchError((error: ApolloError) => {
        //   return of(fromAction.DELETE_FAILED({error: {
        //       errorMessage: error.message,
        //       action: 'DELETE'
        //     }}))
        // })
      ))
  ));

  constructor(
    private actions$: Actions,
    private service: ArchiveService
  ) {
  }
}
