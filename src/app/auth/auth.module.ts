import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AuthRoutingModule} from "./auth-routing.module";
import { AuthComponent } from './auth.component';



@NgModule({
  declarations: [LoginComponent, AuthComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
