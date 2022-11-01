import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComparateurRoutingModule} from './comparateur-routing.module';
import {ComparateurComponent} from "./comparateur.component";
import {ComparateurSearchComponent} from "./comparateur-search/comparateur-search.component";
import {ComparateurSettingComponent} from "./comparateur-setting/comparateur-setting.component";
import {SharedModule} from "../../shared/shared.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { ComparateurMobileViewComponent } from './comparateur-mobile-view/comparateur-mobile-view.component';
import { ComparateurSearchMobileComponent } from './comparateur-mobile-view/comparateur-search-mobile/comparateur-search-mobile.component';
import { ComparateurSettingMobileComponent } from './comparateur-mobile-view/comparateur-setting-mobile/comparateur-setting-mobile.component';


@NgModule({
  declarations: [
    ComparateurComponent,
    ComparateurSearchComponent,
    ComparateurSettingComponent,
    ComparateurMobileViewComponent,
    ComparateurSearchMobileComponent,
    ComparateurSettingMobileComponent
  ],
    imports: [
        CommonModule,
        ComparateurRoutingModule,
        SharedModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatProgressBarModule
    ]
})
export class ComparateurModule { }
