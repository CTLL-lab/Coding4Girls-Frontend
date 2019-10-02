import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Router } from '@angular/router';
import { NotificationsToasterService } from '../../shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { InvalidPasswordError, UserNotFoundError } from '../exceptions';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public invalidField = '';

  public loginForm: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.checkIfValidTokenExists();
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
      rememberme: [false]
    });
  }
  get loginDetails(): {
    username: string;
    password: string;
    rememberme: boolean;
  } {
    return this.loginForm.value;
  }
  loginUser() {
    this.authService.loginUser(this.loginDetails).subscribe(
      r => {
        const token = r['data']['token'];
        if (this.authService.DecodeToken(token)['role'] == 'student') {
          this.notifications.showError('Login not permitted to students');
        } else {
          this.authService.storeUser(token, this.loginDetails.rememberme);
          this.translationService.get('in-code.10').subscribe(k => {
            this.notifications.showSuccess(k);
          });
          this.router.navigateByUrl('/home');
        }
      },
      err => {
        if (err instanceof InvalidPasswordError) {
          this.invalidField = 'password';
          this.translationService.get('in-code.11').subscribe(k => {
            this.notifications.showError(k);
          });
        } else if (err instanceof UserNotFoundError) {
          this.invalidField = 'username';
          this.translationService.get('in-code.12').subscribe(k => {
            this.notifications.showError(k);
          });
        } else {
          this.translationService.get('in-code.3').subscribe(k => {
            this.notifications.showError(k);
          });
        }
      }
    );
  }
}
