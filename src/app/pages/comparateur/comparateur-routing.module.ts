import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComparateurComponent} from "./comparateur.component";

const routes: Routes = [
  {
    path: '',
    component: ComparateurComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparateurRoutingModule { }
