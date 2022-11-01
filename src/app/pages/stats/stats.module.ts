import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsRoutingModule } from './stats-routing.module';
import { StatsComponent } from './stats.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {  MatRadioModule} from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list'; 

@NgModule({
  declarations: [
    StatsComponent
  ],
  imports: [
    CommonModule,
    StatsRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    MatRadioModule,
    MatGridListModule
  
  ]
})
export class StatsModule { }
