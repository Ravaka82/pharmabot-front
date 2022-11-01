import {Injectable} from "@angular/core";
import {Links, MENU} from "../menu";
import {Subject} from "rxjs";
import {set, get} from 'lodash';

interface MenuMap {
  [path: string]: {
    parentIndex: number;
    index: number;
  };
}

interface BadgeParameter {
  path: string;
  badge: number;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  public refresh$: Subject<boolean> = new Subject();
  public menu$: Subject<Links[]> = new Subject();
  public menu: Links[] = [];
  private menuMapByPath: MenuMap = {}

  constructor() {
    let parentIndex = 0;
    let index = 0;
    for (const menu of MENU) {
      index = 0;
      if (menu.children) {
        for (const m of menu.children) {
          this.menuMapByPath[m.path] = {
            parentIndex,
            index
          }
          index++;
        }
      }
      parentIndex++;
    }
    this.refresh$.subscribe(() => this.menu$.next(this.menu));
    this.menu$.subscribe(menu => this.menu = menu);
    this.menu$.next(MENU);
  }

  setBadge({path, badge, color = 'bg-danger-badge'}: BadgeParameter): void {
    const currentMenu = this.menu;
    const target = this.menuMapByPath[path];
    set(currentMenu, [target.parentIndex, 'children', target.index, 'badge'], badge);
    set(currentMenu, [target.parentIndex, 'children', target.index, 'color'], color);
    this.menu$.next(currentMenu);
  }

  getBadge(path: string): number {
    const target = this.menuMapByPath[path];
    return get(this.menu, [target?.parentIndex, 'children', target?.index, 'badge'], 0);
  }

  getColor(path: string): number {
    const target = this.menuMapByPath[path];
    return get(this.menu, [target?.parentIndex, 'children', target?.index, 'color'], 'bg-danger-badge');
  }
}
