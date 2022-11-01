import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {PageGuard} from "../guard/page.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'accueil',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule),
        data: {title: 'Accueil'}
      },
      {
        path: 'catalogue',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/catalogue/catalogue.module').then(m => m.CatalogueModule),
        data: {title: 'Catalogue'}
      },
      {
        path: 'comparateur',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/comparateur/comparateur.module').then(m => m.ComparateurModule),
        data: {title: 'Comparateur'}
      },
      {
        path: 'panier',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/panier/panier.module').then(m => m.PanierModule),
        data: {title: 'Mon panier'}
      },
      {
        path: 'facturation',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/facturation/facturation.module').then(m => m.FacturationModule),
        data: {title: 'Facturation'}
      },
      {
        path: 'chat',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/chat/chat.module').then(m => m.ChatModule),
        data: {title: 'Chat'}
      },
      {
        path: 'utilisateurs',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule),
        data: {title: 'Utilisateurs'}
      },
      {
        path: 'roles',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/roles/roles.module').then(m => m.RolesModule),
        data: {title: 'Rôles'}
      },
      {
        path: 'fournisseurs',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/fournisseur/fournisseur.module').then(m => m.FournisseurModule),
        data: {title: 'Fournisseurs'}
      },
      {
        path: 'gestion-catalogue',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/gestion-catalogue/gestion-catalogue.module').then(m => m.GestionCatalogueModule),
        data: {title: 'Gestion catalogue'}
      },
      {
        path: 'historiques',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/histories/histories.module').then(m => m.HistoriesModule),
        data: {title: 'Historiques'}
      },
      {
        path: 'clients',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/clients/clients.module').then(m => m.ClientsModule),
        data: {title: 'Clients'}
      },
      {
        path: '',
        redirectTo: '/accueil',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/stats/stats.module').then(m => m.StatsModule),
        data: {title: 'Stats'}
      },
      {
        path: 'map',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/map/map.module').then(m => m.MapModule),
        data: {title: 'Map'}
      },
      {
        path: 'etl',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/etl/etl.module').then(m => m.EtlModule),
        data: {title: 'Etl'}
      },
      {
        path: 'analytics',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/analytics/analytics.module').then(m => m.AnalyticsModule),
        data: {title: 'Analytics'}
      },
      {
        path: 'references-xts',
        canActivate: [PageGuard],
        loadChildren: () => import('../pages/references-xts/references-xts.module').then(m => m.ReferencesXtsModule),
        data: {title: 'References-xts'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
