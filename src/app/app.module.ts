import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppStoreModule} from "./@core/store/app-store.module";
import {GraphQLModule} from './@core/graphql.module';
import {AuthModule} from "./auth/auth.module";
import {JwtInterceptor} from "./@core/services/jwt.interceptor";
import {LottieCacheModule, LottieModule} from "ngx-lottie";
import player from 'lottie-web';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {environment} from "../environments/environment";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";


const config: SocketIoConfig = { url: environment.SERVER_URL, options: {
  transports: ['websocket']
  } };


// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppStoreModule,
    GraphQLModule,
    MatDialogModule,
    LottieModule.forRoot({
      player: playerFactory
    }),
    LottieCacheModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }, {
    provide: MatDialogRef,
    useValue: {}
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
