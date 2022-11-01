import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonDeCommandeRoutingModule } from './bon-de-commande-routing.module';
import { BonDeCommandeComponent } from './bon-de-commande.component';
import { BonDeCommandeViewEditComponent } from './bon-de-commande-view-edit/bon-de-commande-view-edit.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ReactiveFormsModule} from "@angular/forms";
import {LottieModule} from "ngx-lottie";
import {NgxMaskModule} from "ngx-mask";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    BonDeCommandeComponent,
    BonDeCommandeViewEditComponent
  ],
  imports: [
    CommonModule,
    BonDeCommandeRoutingModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    LottieModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    
  ]
})
export class BonDeCommandeModule { }
