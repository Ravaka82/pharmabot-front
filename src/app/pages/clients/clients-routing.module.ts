import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientsComponent} from "./clients.component";
import {ClientViewEditComponent} from "./client-view-edit/client-view-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent
  },
  {
    path: ':clientId',
    component: ClientViewEditComponent
  },
  {
    path: '**',
    redirectTo: '/clients'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
