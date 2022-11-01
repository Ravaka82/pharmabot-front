import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HistoryActions, UserActions as fromAction} from "../actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {ApolloError} from "@apollo/client/core";
import {of} from "rxjs";
import {UserService} from "../../services/user.service";
import {Socket} from "ngx-socket-io";
import {generateViewPassword, GET_ITEM_STORAGE} from "../../../utils";

@Injectable()
export class UserEffects {

  user$ = createEffect(() => this.actions$.pipe(
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

  createUser$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.CREATE_REQUESTED),
    mergeMap(({input}) => this.service.add(input)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'CREATE',
                description: `Un nouveau utilisateur '${response.pseudo}' a été créé.`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input: {...input, password: generateViewPassword('*', input.password)},
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

  updateUser$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.UPDATE_REQUESTED),
    mergeMap(({id, changes}) => this.service.update(id, changes)
      .pipe(
        mergeMap(response => {
          if (typeof changes.connected === 'boolean') {
            this.socket.emit('disconnect-user', response);
          }
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'UPDATE',
                description: `L'utilisateur '${changes.pseudo}' a été mis à jour.`,
                user: GET_ITEM_STORAGE('currentUserId') || '',
                metadata: {
                  input: {id, changes: {...changes, password : changes.password && generateViewPassword('*', changes.password)}},
                  output: response
                }
              }]}),
            fromAction.UPDATE_SUCCEED({entry: response})
          ]
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.UPDATE_FAILED({error: {
              errorMessage: error.message,
              action: 'UPDATE'
            }}))
        })
      ))
  ));

  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.DELETE_REQUESTED),
    mergeMap(({ input: { _id } }) => this.service.delete(_id)
      .pipe(
        mergeMap(response => {
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'DELETE',
                description: `L'utilisateur '${response.pseudo}' a été supprimé.`,
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
    private service: UserService,
    private socket: Socket
  ) {
  }
}
