import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {UnsubscribeComponent} from "../unsubscribe/unsubscribe.component";
import {AccountActions} from "src/app/@core/store/actions"
import {AccountSelector} from "src/app/@core/store/selectors";
import {takeUntil} from "rxjs/operators";
import {TokenService} from "../../../@core/services/token.service";
import packageJson from "../../../../../package.json";
import {Observable} from "rxjs";
import {Links, MENU} from "../../../@core/menu";
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from "@angular/router";
import {SidenavService} from "../../../@core/services/sidenav.service";
import {selectAccountMenu$} from "../../../@core/store/selectors/account.selector";
import {BadgeService} from "../../../@core/services/badge.service";
import {UiService} from "../../../@core/services/ui.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent extends UnsubscribeComponent implements OnInit {

  account: any = {};
  isSideNavOpened$!: Observable<boolean>;
  appName = packageJson.name;
  appVersion = packageJson.version;
  links: Links[] = MENU;
  title !: string;
  badge: number = 0;
  color: string | any = 'bg-warning-badge';

  constructor(
    protected store: Store,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private sidenavService: SidenavService,
    private badgeService: BadgeService
  ) {
    super();
    this.router.events.subscribe(event => {
      if(event instanceof ActivationEnd) {
        if (event.snapshot.data['title']) {
          this.title = event.snapshot.data['title']
        }
      }
      if (event instanceof NavigationEnd) {
        this.badgeService.refresh$.next(true);
        setTimeout(() => {
          this.badge = this.badgeService.getBadge(event.url)
          this.color = this.badgeService.getColor(event.url)
        }, 500)
      }
    });
  }

  ngOnInit(): void {

    this.isSideNavOpened$ = this.sidenavService.sidenav$;

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(AccountSelector.selectState)
    ).subscribe(account => {
      this.account = account;
    });

    selectAccountMenu$(this.store).pipe(
      takeUntil(super.unsubscribe())
    ).subscribe(({account, links}) => {
      this.account = account;
      this.links = links;
    })
  }

  toggleMenu(): void {
    this.sidenavService.sidenav$.next(!this.sidenavService.sidenav);
  }
}
