import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../auth/authentication.service';
import { priviledged_roles } from 'src/app/config';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private user: UserService,
    private router: Router,
    private auth: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      this.user.GetUserID() &&
      priviledged_roles.includes(this.user.getRole())
    ) {
      console.log(this.user.getRole());
      return true;
    } else {
      try {
        console.log(route.queryParams['token']);
        if (route.queryParams['token']) {
          this.auth.DecodeToken(route.queryParams['token']);
          this.auth.storeUser(route.queryParams['token'], false);

          return true;
        } else {
          this.auth.logoutUser();
          throw new Error();
        }
      } catch (err) {
        console.error(err);
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
