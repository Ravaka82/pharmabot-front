import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";
import {CommonResolver} from "./@core/store/resolver/common.resolver";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      common: CommonResolver
    },
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'auth',
    canActivate: [AuthGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'facturation-view',
    loadChildren: () => import('./pages/facturation-view/facturation-view.module').then(m => m.FacturationViewModule)
  },
  {
    path: '**',
    redirectTo: '/accueil',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
