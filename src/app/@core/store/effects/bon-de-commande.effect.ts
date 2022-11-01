import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {BonDeCommandeActions as fromAction, HistoryActions} from "../actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {BonDeCommandeService} from "../../services/bon-de-commande.service";
import {GET_ITEM_STORAGE} from "../../../utils";

@Injectable()
export class BonDeCommandeEffects {
  sender$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOAD_REQUESTED),
    mergeMap(({to,subject,text,file,filename}) => this.service.sender({to,subject,text,file,filename})
      .pipe(
        map(response => {
          console.log(fromAction.LOAD_REQUESTED);
          return fromAction.LOAD_SUCCEED({entry: response})    
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.LOAD_FAILED({error: {
              errorMessage: error.message,
              action: 'LOAD'
            }}))
        })
      ))
  ));

  // bonDeCommande$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromAction.LOAD_REQUESTED),
  //   mergeMap(() => this.service.get()
  //     .pipe(
  //       map(response => {
  //         return fromAction.LOAD_SUCCEED({entries: response});
  //       }),
  //       catchError((error: ApolloError) => {
  //         return of(fromAction.LOAD_FAILED({error: {
  //             errorMessage: error.message,
  //             action: 'LOAD'
  //           }}))
  //       })
  //     ))
  // ));

  // addBonDeCommande$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromAction.CREATE_REQUESTED),
  //   mergeMap(({input}) => this.service.add(input)
  //     .pipe(
  //       mergeMap(response => {
  //         return [
  //           HistoryActions.CREATE_REQUESTED({input: [{
  //               action: 'CREATE',
  //               description: `Un nouveau bon de commande  '${response.archive?.designation}' a été créé.`,
  //               user: GET_ITEM_STORAGE('currentUserId') || '',
  //               metadata: {
  //                 input,
  //                 output: response
  //               }
  //             }]}),
  //           fromAction.CREATE_SUCCEED({entry: response})
  //         ]
  //       }),
  //     ))
  // ));

  // updateBonDeCommande$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromAction.UPDATE_REQUESTED),
  //   mergeMap(({id, changes}) => this.service.update(id, changes)
  //     .pipe(
  //       mergeMap(response => {
  //         const entry: any = {...response, ...changes}
  //         return [
  //           HistoryActions.CREATE_REQUESTED({input: [{
  //               action: 'UPDATE',
  //               description: `Le bonDeCommande '${changes.archive}' a été mis à jour.`,
  //               user: GET_ITEM_STORAGE('currentUserId') || '',
  //               metadata: {
  //                 input: {id, changes},
  //                 output: response
  //               }
  //             }]}),
  //           fromAction.UPDATE_SUCCEED({entry})
  //         ]
  //       }),
  //       catchError((error: ApolloError) => {
  //         return of(fromAction.UPDATE_FAILED({error: {
  //             errorMessage: error.message,
  //             action: 'UPDATE'
  //           }}))
  //       })
  //     ))
  // ));

  // deleteBonDeCommande$ = createEffect(() => this.actions$.pipe(
  //   ofType(fromAction.DELETE_REQUESTED),
  //   mergeMap(({ input: { _id } }) => this.service.delete(_id)
  //     .pipe(
  //       mergeMap(response => {
  //         console.log(response)
  //         return [
  //           HistoryActions.CREATE_REQUESTED({input: [{
  //               action: 'DELETE',
  //               description: `Le bon de Commande '${response.archive?.designation}' a été supprimé.`,
  //               user: GET_ITEM_STORAGE('currentUserId') || '',
  //               metadata: {
  //                 input: _id,
  //                 output: response
  //               }
  //             }]}),
  //           fromAction.DELETE_SUCCEED({entry: response})
  //         ]
  //       }),
  //     ))
  // ));

  constructor(
    private actions$: Actions,
    private service: BonDeCommandeService
  ) {
  }
}
