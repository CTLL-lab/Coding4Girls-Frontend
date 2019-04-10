import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Router } from '@angular/router';
import { NotificationsToasterService } from '../../shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public rememberme = false;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {}

  ngOnInit() {
    this.authService.checkIfValidTokenExists();
  }

  loginUser() {
    this.authService.loginUser(this.username, this.password).subscribe(
      r => {
        if (r['success'] === true) {
          const token = r['data']['token'];
          this.authService.storeUser(token, this.rememberme);
          this.translationService.get('in-code.10').subscribe(k => {
            this.notifications.showSuccess(k);
          });
          this.router.navigateByUrl('/home');
        }
        if (r['message'] === 'Wrong password') {
          this.translationService.get('in-code.11').subscribe(k => {
            this.notifications.showError(k);
          });
        }
      },
      err => {
        console.error(err);
        this.translationService.get('in-code.3').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    );
  }
}
