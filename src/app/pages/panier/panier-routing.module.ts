import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PanierComponent} from "./panier.component";


const routes: Routes = [
  {
    path: '',
    component: PanierComponent
  },
  {
    path: '**',
    redirectTo: '/panier'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanierRoutingModule { }
