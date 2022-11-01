import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturationViewRoutingModule } from './facturation-view-routing.module';
import { FacturationViewComponent } from './facturation-view.component';
import {SharedModule} from "../../shared/shared.module";
import {NgxMaskModule} from "ngx-mask";


@NgModule({
  declarations: [
    FacturationViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    FacturationViewRoutingModule
  ],
})
export class FacturationViewModule { }
