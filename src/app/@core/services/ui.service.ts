import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isMobileView$!: BehaviorSubject<boolean>;

  constructor() {
    this.isMobileView$ = new BehaviorSubject(window.innerWidth < environment.BREAKPOINT_RESPONSIVE);
    this.isMobileView$.asObservable();
  }
}
