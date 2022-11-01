import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonDeCommandeViewEditComponent } from './bon-de-commande-view-edit/bon-de-commande-view-edit.component';
import { BonDeCommandeComponent } from './bon-de-commande.component';

const routes: Routes = [
  {
    path: '',
    component: BonDeCommandeComponent
  },
  {
    path: ':bonDeCommandeId',
    component: BonDeCommandeViewEditComponent
  },
  {
    path: '**',
    redirectTo: '/bon-de-commande'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonDeCommandeRoutingModule { }
