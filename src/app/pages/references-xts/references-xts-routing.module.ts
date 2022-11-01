import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferencesXtsComponent } from './references-xts.component';

const routes: Routes = [
  {
    path: '',
    component: ReferencesXtsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferencesXtsRoutingModule { }
