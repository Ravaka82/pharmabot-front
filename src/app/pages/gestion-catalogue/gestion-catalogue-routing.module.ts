import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GestionCatalogueComponent} from "./gestion-catalogue.component";

const routes: Routes = [
  {
    path: '',
    component: GestionCatalogueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCatalogueRoutingModule { }
