import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionCatalogueRoutingModule } from './gestion-catalogue-routing.module';
import { GestionCatalogueComponent } from './gestion-catalogue.component';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    GestionCatalogueComponent
  ],
  imports: [
    CommonModule,
    GestionCatalogueRoutingModule,
    NgxDatatableModule,
    SharedModule
  ]
})
export class GestionCatalogueModule { }
