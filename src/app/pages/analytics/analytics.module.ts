import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import {SharedModule} from "../../shared/shared.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgxJsonViewerModule} from "ngx-json-viewer";
import {LottieModule} from "ngx-lottie";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list'; 

@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    SharedModule,
    NgxDatatableModule,
    NgxJsonViewerModule,
    LottieModule,
    MatCheckboxModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule
  ]
})
export class AnalyticsModule { }
