import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {select, Store} from "@ngrx/store";
import {TokenService} from "../../services/token.service";
import {
  CatalogueActions,
  CatalogueGroupeActions, CatalogueImportActions,
  CatalogueSettingsActions, ClientActions, FactureActions,
  FournisseurActions, HistoryActions, PanierActions,
  RoleActions,
  UserActions,
  ArchiveActions,
  StatsActions,
  RefsMapActions,
  ProductRefsActions,
  StatsCommonNameActions,
  SearchActions,
  SearchGraphActions,
  MapActions
} from "../actions";
import {AccountSelector} from "../selectors";
import {filter} from "rxjs/operators";
import {Socket} from "ngx-socket-io";
import {SET_ITEM_STORAGE} from "../../../utils";

@Injectable({
  providedIn: 'root'
})
export class CommonResolver implements Resolve<boolean> {
  constructor(
    private store: Store<any>, private tokenService: TokenService,
    private socket: Socket
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.tokenService.getToken()) {
      let userId: any;
      this.store.dispatch(UserActions.LOAD_REQUESTED());
      this.store.dispatch(RoleActions.LOAD_REQUESTED());
      this.store.dispatch(FournisseurActions.LOAD_REQUESTED());
      this.store.dispatch(CatalogueGroupeActions.LOAD_REQUESTED({}));
      this.store.dispatch(CatalogueImportActions.LOAD_REQUESTED({}));
      this.store.dispatch(CatalogueActions.LOAD_REQUESTED());
      this.store.dispatch(HistoryActions.LOAD_REQUESTED());
      this.store.dispatch(RefsMapActions.LOAD_REQUESTED());
      this.store.dispatch(ClientActions.LOAD_REQUESTED());
      this.store.dispatch(PanierActions.LOAD({entries: []}));
      this.store.dispatch(ProductRefsActions.LOAD_REQUESTED());
      this.store.dispatch(StatsActions.LOAD_REQUESTED_DESIGNATION({
        designation: '',
        dateStart:'',
        dateEnd:''
      }));
      this.store.dispatch(SearchActions.LOAD_REQUESTED());
      this.store.dispatch(SearchGraphActions.LOAD_REQUESTED({
        month: '',
        nombre: ''
      }));
      this.store.dispatch(StatsCommonNameActions.LOAD_REQUESTED_COMMON_NAME({
        commonName: '',
        dateStart:'',
        dateEnd:''
      }));
      this.store.dispatch(ArchiveActions.LOAD_REQUESTED({
        dateStart: '',
        dateEnd: ''
      }));
      this.store.dispatch(MapActions.LOAD_REQUESTED({
        addOneFournisseurId:'',
      }));
      this.store.pipe(
        select(AccountSelector.selectState),
        filter(state => !!state._id),
      ).subscribe(userState => {
        if (userId !== userState?._id) {
          userId = userState?._id;
          SET_ITEM_STORAGE('currentUser', userState?.pseudo);
          SET_ITEM_STORAGE('currentUserId', userState?._id);
          SET_ITEM_STORAGE('currentUserGroupId', userState?.catalogueGroupe);
          this.socket.emit('update-socket', userState);
          this.store.dispatch(CatalogueSettingsActions.LOAD_REQUESTED({
            query: { catalogueGroupeId: userState.catalogueGroupe || '' }
          }));

          const factureQuery = userState.role?.name === 'ADMIN' || userState.role?.name === 'MANAGER' ? {} : { catalogueGroupe: userState.catalogueGroupe }
          this.store.dispatch(FactureActions.LOAD_REQUESTED({
            query: factureQuery
          }));
        }
      })

      return true;
    }
    return false;
  }
}
