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

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [LoginComponent, RegisterComponent],
  providers: [AuthenticationService]
})
export class AuthenticationModule {}
