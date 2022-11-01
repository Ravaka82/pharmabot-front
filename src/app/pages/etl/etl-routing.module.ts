import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtlComponent } from './etl.component';

const routes: Routes = [
  {
    path: '',
    component: EtlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtlRoutingModule { }
