import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FactureDetailComponent} from "./facture-detail/facture-detail.component";
import {FacturationComponent} from "./facturation.component";
import {FacturationRoutingModule} from "./facturation-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {FactureAjoutComponent} from './facture-ajout/facture-ajout.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {LottieModule} from "ngx-lottie";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";
import {NgxPrintModule} from "ngx-print";
import { FactureMobileViewComponent } from './facture-mobile-view/facture-mobile-view.component';
import { FactureMobileReceivedbyComponent } from './facture-mobile-view/facture-mobile-receivedby/facture-mobile-receivedby.component';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    FactureDetailComponent,
    FacturationComponent,
    FactureAjoutComponent,
    FactureMobileViewComponent,
    FactureMobileReceivedbyComponent
  ],
  imports: [
    CommonModule,
    FacturationRoutingModule,
    SharedModule,
    LottieModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    NgxPrintModule,
  ]
})
export class FacturationModule { }
