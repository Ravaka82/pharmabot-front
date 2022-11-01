import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AccountActions as fromAction, HistoryActions} from '../actions';
import {catchError, mergeMap} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {of} from "rxjs";
import {ApolloError} from "@apollo/client/core";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {Socket} from "ngx-socket-io";
import {REMOVE_ITEM_STORAGE} from "../../../utils";

@Injectable()
export class AccountEffects {

  login$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOGIN_REQUESTED),
    mergeMap(({input}) => this.loginService.login(input)
      .pipe(
        mergeMap(response => {
          this.tokenService.setToken(response?.token);
          this.router.navigateByUrl('/accueil');
          this.socket.emit('logged', response);
          return [
            HistoryActions.CREATE_REQUESTED({input: [{
                action: 'LOGIN',
                description: `${response.pseudo} s'est connecté.`
              }]}),
            fromAction.LOGIN_SUCCEED({entry: response})
          ]
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.LOGIN_FAILED({error: {
              errorMessage: error.message,
              action: 'LOGIN',
            }}))
        })
      ))
  ));

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(fromAction.LOGOUT_REQUESTED),
    mergeMap(({input}) => this.loginService.logout(input)
      .pipe(
        mergeMap(response => {
          this.tokenService.removeToken();
          this.router.navigateByUrl('/auth/login');
          this.socket.emit('logout', response);
          REMOVE_ITEM_STORAGE('currentUser');
          REMOVE_ITEM_STORAGE('currentUserId');
          REMOVE_ITEM_STORAGE('currentUserGroupId');

          return [
            HistoryActions.CREATE_REQUESTED({input:[{
                action: 'LOGOUT',
                description: `${response.pseudo} s'est déconnecté.`
              }]}),
            fromAction.LOGOUT_SUCCEED({entry: response})

          ]
        }),
        catchError((error: ApolloError) => {
          return of(fromAction.LOGOUT_FAILED({error: {
              errorMessage: error.message,
              action: 'LOGOUT'
            }}))
        })
      ))
  ));

  constructor(
    private actions$: Actions,
    private loginService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private socket: Socket
  ) {}
}
