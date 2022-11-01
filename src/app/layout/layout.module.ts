import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from "./layout-routing.module";
import {SidenavComponent} from '../shared/component/sidenav/sidenav.component';
import {NavbarComponent} from '../shared/component/navbar/navbar.component';
import {SharedModule} from "../shared/shared.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";

@NgModule({
  declarations: [
    LayoutComponent,
    SidenavComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  providers: []
})
export class LayoutModule { }
