import {Component, OnInit} from '@angular/core';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LoadingModalComponent} from "../shared/component/loading-modal/loading-modal.component";
import {UnsubscribeComponent} from "../shared/component/unsubscribe/unsubscribe.component";
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {FactureSelector, PanierSelector} from "../@core/store/selectors";
import {BadgeService} from "../@core/services/badge.service";
import {SidenavService} from "../@core/services/sidenav.service";
import {Observable} from "rxjs";
import {UiService} from "../@core/services/ui.service";
import {AccountActions} from "../@core/store/actions";
import {GET_ITEM_STORAGE} from "../utils";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends UnsubscribeComponent implements OnInit {

  loadingDialogRef!: MatDialogRef<any>;
  isSideNavOpened$ !: Observable<boolean>;
  isMobile$ !: Observable<boolean>

  constructor(
    private router: Router,
    private dialog: MatDialog,
    protected store: Store,
    private badgeService: BadgeService,
    private sidenavService: SidenavService,
    private uiService: UiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isMobile$ = this.uiService.isMobileView$;
    this.isSideNavOpened$ = this.sidenavService.sidenav$;

    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingDialogRef = this.dialog.open(LoadingModalComponent);
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingDialogRef.close();
      }
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FactureSelector.selectAll)
    ).subscribe(factures => {
      const factureWaitingCount = factures.reduce((prev, curr) => prev + (curr?.status === 'WAITING' ? 1 : 0), 0);
      this.badgeService.setBadge({
        path: '/facturation',
        badge: factureWaitingCount,
        color: 'bg-danger-badge'
      });
    })

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(PanierSelector.selectCount)
    ).subscribe(count => {
      this.badgeService.setBadge({
        path: '/panier',
        badge: count,
        color: 'bg-yellow-badge'
      });
    })
  }

  closeSideNav(): void {
    this.sidenavService.close()
  }

  logout(): void {
    this.store.dispatch(AccountActions.LOGOUT_REQUESTED({
      input: {
        _id: GET_ITEM_STORAGE('currentUserId'),
        token: GET_ITEM_STORAGE('token')
      }
    }))
  }
}
