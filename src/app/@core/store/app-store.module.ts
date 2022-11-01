import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from "@ngrx/store";
import * as fromReducer from './reducers';
import * as fromEffects from './effects';
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../../../environments/environment";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(fromReducer.reducers, {}),
    EffectsModule.forRoot(fromEffects.AppEffects),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ]
})
export class AppStoreModule { }
