import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { languages_available, languages_flags_assets } from 'src/app/config';
import { AuthenticationService } from 'src/app/authentication/services/auth/authentication.service';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/authentication/services/user/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User;
  constructor(
    public auth: AuthenticationService,
    private router: Router,
    public userService: UserService,
    public translate: TranslateService
  ) {}
  counter = 0;
  language = 'en';
  imagePath: string;
  languages_available;
  languages_flags_assets;

  ngOnInit() {
    this.userService.user.subscribe(x => {
      this.user = x;
    });
    this.imagePath = 'assets/FlagIcons/flag_united_kingdom.png';
    // this.user.getUserLanguage().subscribe(r => {
    //   this.changeFlagToLanguage(r);
    // });
    this.languages_available = languages_available;
    this.languages_flags_assets = languages_flags_assets;
  }

  logout() {
    this.auth.logoutUser();
    this.router.navigateByUrl('/home');
  }

  public toggleNextFlag() {
    //   this.counter = (this.counter + 1) % languages_available.length;
    //   this.imagePath = languages_flags_assets[this.counter];
    //   this.changeLanguageTo(languages_available[this.counter]);
  }
  public changeLanguageTo(lang: string) {
    //   this.changeFlagToLanguage(lang);
    //   this.user.changeUserLanguage(lang).subscribe();
  }
  public changeFlagToLanguage(lang: string) {
    this.counter = languages_available.findIndex(x => x === lang);
    if (this.counter < 0) {
      this.counter = 0;
    }
    this.imagePath = languages_flags_assets[this.counter];
  }
}
