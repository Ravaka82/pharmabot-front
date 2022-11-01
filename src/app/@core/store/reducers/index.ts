import {
  AccountState,
  FournisseurState,
  RoleState,
  CatalogueGroupeState,
  UserState,
  CatalogueSettingsState,
  CatalogueState,
  HistoryState,
  ClientState,
  FactureState,
  CatalogueImportState,
  ArchiveState,
  StatsState,
  RefsMapState,
  ProductRefsState,
  StatsCommonNameState,
  SearchState,
  SearchGraphState,
  MapState,
  BonDeCommandeState
} from '../states';
import {ActionReducerMap} from "@ngrx/store";
import * as fromFournisseurReducer from './fournisseur.reducer';
import * as fromAccountReducer from './account.reducer';
import * as fromRoleReducer from './role.reducer';
import * as fromCatalogueGroupeReducer from './catalogue-groupe.reducer';
import * as fromCatalogueSettingsReducer from './catalogue-settings.reducer';
import * as fromUserReducer from './user.reducer';
import * as fromCatalogueReducer from './catalogue.reducer';
import * as fromHistoryReducer from './history.reducer';
import * as fromClientReducer from './client.reducer';
import * as fromFactureReducer from './facture.reducer';
import * as fromCatalogueImportReducer from './catalogue-import.reducer';
import * as fromPanierReducer from './panier.reducer';
import PanierState from "../states/panier.state";
import * as fromArchiveReducer from './archive.reducer';
import * as fromStatsReducer from './stats.reducer';
import * as fromRefsMapReducer from './refs-map.reducer';
import * as fromProductRefsReducer from './product-refs.reducer';
import * as fromStatsCommonNameReducer from './statsCommonName.reducer';
import * as fromSearchReducer from './search.reducer';
import * as fromSearchGraphReducer from './search-graph.reducer';
import * as fromMapReducer from './map.reducer';
import * as fromBondeCommandeReducer from './bon-de-commande.reducer';


export interface State {
  account: AccountState;
  fournisseur: FournisseurState;
  role: RoleState;
  'catalogue-groupe': CatalogueGroupeState;
  'catalogue-settings': CatalogueSettingsState;
  'catalogue-import': CatalogueImportState;
  catalogue: CatalogueState;
  user: UserState;
  history: HistoryState;
  client: ClientState;
  facture: FactureState;
  panier: PanierState;
  archive: ArchiveState;
  stats: StatsState;
  refsMap: RefsMapState;
  productRefs: ProductRefsState;
  statsCommonName: StatsCommonNameState;
  search: SearchState;
  map: MapState;
  'search-graph': SearchGraphState;
  'bon-de-commande': BonDeCommandeState;
}

export const reducers: ActionReducerMap<State> = {
  account: fromAccountReducer.reducer,
  fournisseur: fromFournisseurReducer.reducer,
  role: fromRoleReducer.reducer,
  'catalogue-groupe': fromCatalogueGroupeReducer.reducer,
  'catalogue-settings': fromCatalogueSettingsReducer.reducer,
  'catalogue-import': fromCatalogueImportReducer.reducer,
  catalogue: fromCatalogueReducer.reducer,
  user: fromUserReducer.reducer,
  history: fromHistoryReducer.reducer,
  client: fromClientReducer.reducer,
  facture: fromFactureReducer.reducer,
  panier: fromPanierReducer.reducer,
  archive: fromArchiveReducer.reducer,
  stats: fromStatsReducer.reducer,
  refsMap: fromRefsMapReducer.reducer,
  map: fromMapReducer.reducer,
  productRefs: fromProductRefsReducer.reducer,
  statsCommonName:fromStatsCommonNameReducer.reducer,
  search: fromSearchReducer.reducer,
  'search-graph': fromSearchGraphReducer.reducer,
  'bon-de-commande': fromBondeCommandeReducer.reducer,
};
