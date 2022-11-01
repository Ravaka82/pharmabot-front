import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FournisseurComponent } from './fournisseur.component';
import {SharedModule} from "../../shared/shared.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { FournisseurEntityComponent } from './fournisseur-entity/fournisseur-entity.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {CatalogueGroupeComponent} from "./catalogue-groupe/catalogue-groupe.component";


@NgModule({
  declarations: [
    FournisseurComponent,
    CatalogueGroupeComponent,
    FournisseurEntityComponent
  ],
    imports: [
        CommonModule,
        FournisseurRoutingModule,
        SharedModule,
        MatCheckboxModule,
        MatSlideToggleModule
    ]
})
export class FournisseurModule { }
