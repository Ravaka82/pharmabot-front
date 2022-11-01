import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PanierRoutingModule} from './panier-routing.module';
import {PanierComponent} from './panier.component';
import {SharedModule} from "../../shared/shared.module";
import {PanierTableComponent} from './panier-table/panier-table.component';
import {PanierDetailComponent } from './panier-detail/panier-detail.component';
import {NgxPrintModule} from "ngx-print";
import { PanierUploadComponent } from './panier-upload/panier-upload.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PanierComponent,
    PanierTableComponent,
    PanierDetailComponent,
    PanierUploadComponent
  ],
  imports: [
    CommonModule,
    PanierRoutingModule,
    SharedModule,
    NgxPrintModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ]
})
export class PanierModule { }
