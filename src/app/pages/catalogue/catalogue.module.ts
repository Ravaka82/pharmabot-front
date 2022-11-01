import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CatalogueRoutingModule} from './catalogue-routing.module';
import {CatalogueImportComponent} from "./catalogue-import/catalogue-import.component";
import {CatalogueComponent} from "./catalogue.component";
import {ImportSettingComponent} from "./catalogue-import/import-setting/import-setting.component";
import {ImportValidationComponent} from "./catalogue-import/import-validation/import-validation.component";
import {SharedModule} from "../../shared/shared.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {LottieModule} from "ngx-lottie";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { CatalogueMobileViewComponent } from './catalogue-mobile-view/catalogue-mobile-view.component';


@NgModule({
  declarations: [CatalogueImportComponent, CatalogueComponent, ImportSettingComponent, ImportValidationComponent, CatalogueMobileViewComponent],
    imports: [
        CommonModule,
        CatalogueRoutingModule,
        SharedModule,
        DragDropModule,
        LottieModule,
        MatProgressBarModule
    ]
})
export class CatalogueModule { }
