import {Component, EventEmitter, OnInit, Output} from '@angular/core';
// @ts-ignore
import packageJson from '../../../../../package.json';
import {Store} from "@ngrx/store";
import {AccountSelector, UserSelector} from "../../../@core/store/selectors";
import {UnsubscribeComponent} from "../unsubscribe/unsubscribe.component";
import {filter, map, takeUntil} from "rxjs/operators";
import {combineLatest} from "rxjs";
import {Links, MENU} from "../../../@core/menu";
import {BadgeService} from "../../../@core/services/badge.service";
import {SidenavService} from "../../../@core/services/sidenav.service";
import {AccountActions} from "../../../@core/store/actions";
import {TokenService} from "../../../@core/services/token.service";
import {selectAccountMenu$} from "../../../@core/store/selectors/account.selector";
import {UiService} from "../../../@core/services/ui.service";
import {ActivationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends UnsubscribeComponent implements OnInit {

  account: any = {};
  appName = packageJson.name;
  appVersion = packageJson.version;
  isSideNavOpened = false;
  isMobile = false;
  currentPath = '/accueil';
  links: Links[] = this.badgeService.menu;

  constructor(
    protected store: Store,
    private badgeService: BadgeService,
    private sidenavService: SidenavService,
    private tokenService: TokenService,
    private uiService: UiService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sidenavService.sidenav$.subscribe(value => this.isSideNavOpened = value);
    this.uiService.isMobileView$.subscribe(isMobile => {
      this.isMobile = isMobile;
      selectAccountMenu$(this.store, isMobile).pipe(
        takeUntil(super.unsubscribe())
      ).subscribe(({account, links}) => {
        this.account = account;
        this.links = links;
      });
    })
  }

  linkClicked(path: string): void {
    if (this.isMobile) {
      this.sidenavService.close();
    }
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.store.dispatch(AccountActions.LOGOUT_REQUESTED({
      input: {
        _id: this.account._id || '',
        token: this.tokenService.getToken() || ''
      }
    }))
  }
}
