import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { User } from '../services/user/user';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import {
  UsernameAlreadyInUseError,
  EmailAlreadyInUseError
} from '../exceptions';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  passwordver: string;
  errorMessage = '';
  msg: any;
  code = '';
  terms_accepted = false;
  invalidInput = '';
  passwordsMatch = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {}

  ngOnInit() {}
  verifyRegistrationDetails() {
    if (!this.user.username) {
      return 'in-code.15';
    }
    if (this.passwordver !== this.user.password) {
      return 'in-code.16';
    }

    return null;
  }
  registerUser() {
    if (!this.terms_accepted) {
      return;
    }
    const validForm = this.verifyRegistrationDetails();
    if (validForm != null) {
      this.translationService.get(validForm).subscribe(r => {
        this.notifications.showError(r);
      });
      return;
    }
    this.authService
      .registerUser(
        this.user.username,
        this.user.password,
        this.user.email,
        this.user.fname,
        this.user.lname,
        this.code
      )
      .subscribe(
        r => {
          this.translationService.get('in-code.17').subscribe(k => {
            this.notifications.showSuccess(k);
          });
          this.router.navigateByUrl('/login');
        },
        err => {
          if (err instanceof UsernameAlreadyInUseError) {
            this.invalidInput = 'username';
          } else if (err instanceof EmailAlreadyInUseError) {
            this.invalidInput = 'email';
          }
          this.translationService.get('in-code.18').subscribe(r => {
            this.notifications.showError(r);
          });
        }
      );
  }
  checkIfPasswordsMatch() {
    this.passwordsMatch = this.passwordver == this.user.password;
  }
}
