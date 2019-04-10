import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

export function getToken() {
  if (localStorage.getItem('token') != null) {
    return localStorage.getItem('token');
  }
  if (sessionStorage.getItem('token') != null) {
    return sessionStorage.getItem('token');
  }
  return null;
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        // headerName: 'Authorization',
        // authScheme: 'Bearer ',
        skipWhenExpired: true,
        whitelistedDomains: ['api.designit.e-ce.uth.gr', 'localhost:5000'],
        blacklistedRoutes: []
      }
    }),
    CoreModule
  ],
  providers: [JwtHelperService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {}
