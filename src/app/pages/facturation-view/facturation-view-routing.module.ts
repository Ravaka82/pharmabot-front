import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FacturationViewComponent} from "./facturation-view.component";

const routes: Routes = [{
  path: '',
  component: FacturationViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturationViewRoutingModule { }
