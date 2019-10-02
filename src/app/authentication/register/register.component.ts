import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { User } from '../services/user/user';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import {
  UsernameAlreadyInUseError,
  EmailAlreadyInUseError,
  InvalidRegistrationCode
} from '../exceptions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage = '';
  msg: any;
  invalidInput = '';

  public registerForm: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', RxwebValidators.required()],
      password: ['', RxwebValidators.required()],
      vpassword: ['', RxwebValidators.compare({ fieldName: 'password' })],
      email: ['', RxwebValidators.email()],
      fname: [''],
      lname: [''],
      code: ['', RxwebValidators.required()],
      acceptedTerms: [false, Validators.requiredTrue]
    });
  }
  public get registerDetails() {
    return this.registerForm.value;
  }
  registerUser() {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService
      .registerUser(
        this.registerDetails.username,
        this.registerDetails.password,
        this.registerDetails.email,
        this.registerDetails.fname,
        this.registerDetails.lname,
        this.registerDetails.code
      )
      .subscribe(
        r => {
          this.translationService.get('in-code.17').subscribe(k => {
            this.notifications.showSuccess(k);
          });
          this.router.navigateByUrl('/login');
        },
        err => {
          let errorMessage = 'in-code.18';
          if (err instanceof UsernameAlreadyInUseError) {
            this.invalidInput = 'username';
            errorMessage = 'in-code.19';
          } else if (err instanceof EmailAlreadyInUseError) {
            this.invalidInput = 'email';
            errorMessage = 'in-code.20';
          } else if (err instanceof InvalidRegistrationCode) {
            this.invalidInput = 'code';
          } else {
            this.invalidInput = '';
          }
          this.translationService.get(errorMessage).subscribe(r => {
            this.notifications.showError(r);
          });
        }
      );
  }
}
