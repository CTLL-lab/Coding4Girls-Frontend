import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './services/auth/authentication.service';
import { FormsModule } from '@angular/forms';

// import ngx-translate and the http loader
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule } from '../shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';

export function getToken() {
  if (localStorage.getItem('token') != null) {
    return localStorage.getItem('token');
  }
  if (sessionStorage.getItem('token') != null) {
    return sessionStorage.getItem('token');
  }
  return null;
}
@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
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
    SharedModule
  ],
  declarations: [LoginComponent, RegisterComponent],
  providers: [AuthenticationService]
})
export class AuthenticationModule {}
