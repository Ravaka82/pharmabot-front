import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferencesXtsRoutingModule } from './references-xts-routing.module';
import { ReferencesXtsComponent } from './references-xts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { LottieModule } from 'ngx-lottie';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


@NgModule({
  declarations: [
    ReferencesXtsComponent
  ],
  imports: [
    CommonModule,
    ReferencesXtsRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule, 
    NgxPaginationModule,
    LottieModule,
    MatCheckboxModule,
    NgxDatatableModule,
    NgxJsonViewerModule,

  ]
})
export class ReferencesXtsModule { }
