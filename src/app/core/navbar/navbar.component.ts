import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { languages_available } from 'src/app/config';
import { AuthenticationService } from 'src/app/authentication/services/auth/authentication.service';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { User } from 'src/app/authentication/services/user/user';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { CouldntLogoutError } from 'src/app/authentication/exceptions';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User;
  counter = 0;
  public currentLanguage;
  public languages_available = languages_available;
  constructor(
    public auth: AuthenticationService,
    private router: Router,
    public userService: UserService,
    public translate: TranslateService,
    public notifications: NotificationsToasterService,
    public nav: NavbarService
  ) {}

  ngOnInit() {
    this.userService.user.subscribe(x => {
      this.user = x;
    });
    this.currentLanguage = languages_available[0];
    // this.user.getUserLanguage().subscribe(r => {
    //   this.changeFlagToLanguage(r);
    // });
  }

  logout() {
    try {
      this.auth.logoutUser();
      this.router.navigateByUrl('/home');
      this.notifications.showSuccess('');
    } catch (err) {
      if (err instanceof CouldntLogoutError) {
        this.translate
          .get('in-code.3')
          .toPromise()
          .then(x => {
            this.notifications.showError(x);
          });
      }
    }
  }

  public toggleNextFlag() {
    this.counter = (this.counter + 1) % this.languages_available.length;
    this.currentLanguage = this.languages_available[this.counter];
    this.changeLanguageTo(this.currentLanguage.code);
  }
  public changeLanguageTo(lang: string) {
    //   this.changeFlagToLanguage(lang);
    //   this.user.changeUserLanguage(lang).subscribe();
  }
}
