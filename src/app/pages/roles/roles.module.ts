import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RoleNameComponent } from './role-name/role-name.component';
import { RolePageListComponent } from './role-page-list/role-page-list.component';
import {FlexModule} from "@angular/flex-layout";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {SharedModule} from "../../shared/shared.module";
import {MatCheckboxModule} from "@angular/material/checkbox";


@NgModule({
  declarations: [
    RolesComponent,
    RoleNameComponent,
    RolePageListComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    FlexModule,
    NgxDatatableModule,
    SharedModule,
    MatCheckboxModule
  ]
})
export class RolesModule { }
