import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import {SharedModule} from "../../shared/shared.module";
import { ClientViewEditComponent } from './client-view-edit/client-view-edit.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ReactiveFormsModule} from "@angular/forms";
import {LottieModule} from "ngx-lottie";
import {NgxMaskModule} from "ngx-mask";


@NgModule({
  declarations: [
    ClientsComponent,
    ClientViewEditComponent
  ],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        SharedModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        LottieModule,
        NgxMaskModule.forRoot()
    ]
})
export class ClientsModule { }
