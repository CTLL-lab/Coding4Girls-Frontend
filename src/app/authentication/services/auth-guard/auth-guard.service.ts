import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../auth/authentication.service';

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
    if (this.user.GetUserID()) {
      return true;
    } else {
      try {
        this.auth.DecodeToken(route.queryParams['token']);
        this.auth.storeUser(route.queryParams['token'], false);
        return true;
      } catch (err) {
        console.error(err);
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
