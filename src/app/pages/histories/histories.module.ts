import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriesRoutingModule } from './histories-routing.module';
import {HistoriesComponent} from "./histories.component";
import {SharedModule} from "../../shared/shared.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import {NgxJsonViewerModule} from "ngx-json-viewer";
import {LottieModule} from "ngx-lottie";
import {MatCheckboxModule} from "@angular/material/checkbox";


@NgModule({
  declarations: [HistoriesComponent, HistoryDetailComponent],
    imports: [
        CommonModule,
        HistoriesRoutingModule,
        NgxDatatableModule,
        NgxJsonViewerModule,
        SharedModule,
        LottieModule,
        MatCheckboxModule
    ]
})
export class HistoriesModule { }
