import {Component, HostListener} from '@angular/core';
import {NgwWowService} from "ngx-wow";
import {SocketService} from "./@core/services/socket.service";
import {ActivationStart, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {environment} from "../environments/environment";
import {UiService} from "./@core/services/ui.service";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

  private isMobile = false;
  private isMobileViewUpdated = false;

  @HostListener('window:resize') windowResize(): void {
    this.isMobile = window.innerWidth < environment.BREAKPOINT_RESPONSIVE;
    if (this.isMobile !== this.isMobileViewUpdated) {
      this.uiService.isMobileView$.next(this.isMobile);
    }
  }

  constructor(
    private wowService: NgwWowService,
    private socketService: SocketService,
    private router: Router,
    private titleService: Title,
    private uiService: UiService
  ) {
    this.isMobile = window.innerWidth < environment.BREAKPOINT_RESPONSIVE;
    this.uiService.isMobileView$.subscribe(isMobileView => this.isMobileViewUpdated = isMobileView);
    this.wowService.init();
    this.socketService.init();
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationStart),
        map(event => event as ActivationStart)
      )
      .subscribe((event) => {
        const data = event.snapshot.data;
        const title = `${ data['title'] ? data['title'] + ' | ' : ''} Pharmabot`;
        this.titleService.setTitle(title);
    })

  }
}
