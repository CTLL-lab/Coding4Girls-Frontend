import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private user: UserService) {}

  canActivate(): boolean {
    if (this.user.GetUserID()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
