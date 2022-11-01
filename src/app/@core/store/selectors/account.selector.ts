import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {AccountState} from "../states";
import {combineLatest} from "rxjs";
import {AccountSelector, UserSelector} from "./index";
import {User} from "../../interfaces"
import {filter, map} from "rxjs/operators";
import {MENU} from "../../menu";

export const getRouteState = createFeatureSelector<AccountState>('account');

export const selectState = createSelector(
  getRouteState,
  (state): AccountState => state
);

export const selectAuthorizedPages = createSelector(
  getRouteState,
  (state): string[] => state.role?.pages || []
)

export const selectAccountMenu$ = (store: Store, isMobile = false) => {
  return combineLatest([
    store.select(AccountSelector.selectState),
    store.select(UserSelector.selectUsers)
  ]).pipe(
    filter(([userState, users]) => !!userState && !!users),
    map(([userState, users]) => {
      return users.find(user => user._id === userState._id) || {} as User.Entry;
    }),
      map(account => {
      const links = MENU.map(link => {
        return {
          ...link,
          children: link.children?.filter(child => {
            const hideOneMobile = child.hideOnMobile && isMobile;
            return account?.role?.pages.indexOf(child.path) > -1 && !hideOneMobile;
          })
        }
      }).filter((entry: any) => (entry.children?.length > 0));
      return {account, links}
    })
  )
}
