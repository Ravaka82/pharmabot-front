import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogueComponent} from "./catalogue.component";
import {CatalogueImportComponent} from "./catalogue-import/catalogue-import.component";

const routes: Routes = [
  {
    path: '',
    component: CatalogueComponent
  },
  {
    path: ':fournisseur',
    component: CatalogueImportComponent
  },
  {
    path: '**',
    redirectTo: '/catalogue'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
