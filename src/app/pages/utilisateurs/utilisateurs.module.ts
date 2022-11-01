import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { UtilisateursComponent } from './utilisateurs.component';
import {SharedModule} from "../../shared/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { UserViewEditComponent } from './user-view-edit/user-view-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {LottieModule} from "ngx-lottie";
import player from 'lottie-web';

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    UtilisateursComponent,
    UserViewEditComponent
  ],
    imports: [
        CommonModule,
        UtilisateursRoutingModule,
        SharedModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        LottieModule.forRoot({player: playerFactory })
    ]
})
export class UtilisateursModule { }
