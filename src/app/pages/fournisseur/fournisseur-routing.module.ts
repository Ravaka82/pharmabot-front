import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FournisseurComponent} from "./fournisseur.component";

const routes: Routes = [
  {
    path: '',
    component: FournisseurComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FournisseurRoutingModule { }
