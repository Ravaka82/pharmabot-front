import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {TokenService} from "../@core/services/token.service";
import {Store} from "@ngrx/store";
import {AccountActions} from "../@core/store/actions";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private token: TokenService, private router: Router, protected store: Store) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = this.token.getToken();

    if (token) {
      return new Promise(async (resolve) => {
        const {valid: isTokenValid, user} = await this.token.validateToken(token);
        if (isTokenValid) {
          this.store.dispatch(AccountActions.UPDATE_SUCCEED({entry: user}))
          if (state.url === '/auth/login') {
            this.router.navigateByUrl('/accueil');
          }
          resolve(true);
        } else {
          this.token.removeToken();
          this.router.navigateByUrl('/auth/login');
          resolve(false);
        }
      })
    } else if (state.url === '/auth/login') {
      return true;
    }
    this.router.navigateByUrl('/auth/login');
    return true;
  }

}
