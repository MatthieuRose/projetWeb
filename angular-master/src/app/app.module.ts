import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './shared/auth.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpErrorInterceptorService} from './shared/http-error-interceptor.service';
import {TokenInterceptorService} from './shared/token-interceptor.service';
import {HomeModule} from './home/home.module';
import {AuthModule} from './auth/auth.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NavComponent } from './layout/nav/nav.component';
import {AngularMaterialModule} from './angular-material.module';
import {PersonnesModule} from './personnes/personnes.module';
import { GameComponent} from './game/game.component';
import {ListPersonnesComponent} from './personnes/list-personnes/list-personnes.component';
import {FormsModule} from '@angular/forms';
import { DonnneesServeurComponent } from './donnnees-serveur/donnnees-serveur.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavComponent,
    GameComponent,
    ListPersonnesComponent,
    DonnneesServeurComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HomeModule,
        AuthModule,
        PersonnesModule,
        FlexLayoutModule,
        AngularMaterialModule,
        AppRoutingModule,
        FormsModule,
    ],
  providers: [AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    [{provide: LOCALE_ID, useValue: 'fr-FR'}]],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
