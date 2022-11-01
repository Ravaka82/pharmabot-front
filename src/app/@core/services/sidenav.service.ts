import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {GET_ITEM_STORAGE, SET_ITEM_STORAGE} from "../../utils";

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  sidenav$!: BehaviorSubject<boolean>;
  sidenav = false;

  constructor() {
    const isSideNavOpened = GET_ITEM_STORAGE('isSideNavOpened') || false;
    this.sidenav$ = new BehaviorSubject(isSideNavOpened);
    this.sidenav$.asObservable();
    this.sidenav$.subscribe(value => {
      this.sidenav = value;
      SET_ITEM_STORAGE('isSideNavOpened', value);
    })
  }

  close(): void {
    this.sidenav$.next(!this.sidenav);
  }
}
