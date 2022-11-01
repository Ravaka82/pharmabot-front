import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from "@ngrx/store";
import {first, map} from "rxjs/operators";
import {AccountSelector} from "../@core/store/selectors";

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate {

  constructor(protected store: Store, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,): Observable<boolean> {
    return this.store.pipe(
      first(),
      select(AccountSelector.selectAuthorizedPages),
      map(authorizedPages => {
        const parentPath = '/' + state.url.split('/')[1];
        const isAuthorized = authorizedPages.indexOf(parentPath) > -1;
        if (!isAuthorized) {
          this.router.navigateByUrl('/accueil');
          return false;
        }
        return isAuthorized;
      })
    )
  }

}
