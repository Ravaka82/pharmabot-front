import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FacturationComponent} from "./facturation.component";
import {FactureAjoutComponent} from "./facture-ajout/facture-ajout.component";

const routes: Routes = [
  {
    path: '',
    component: FacturationComponent
  },
  {
    path: 'new',
    component: FactureAjoutComponent
  },
  {
    path: '**',
    redirectTo: '/facturation'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturationRoutingModule { }
