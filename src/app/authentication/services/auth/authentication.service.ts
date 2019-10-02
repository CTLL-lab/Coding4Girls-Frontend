import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { apiURL } from '../../../config';
import { UserService } from '../user/user.service';
import {
  InvalidPasswordError,
  UserNotFoundError,
  UsernameAlreadyInUseError,
  EmailAlreadyInUseError,
  CouldntLogoutError,
  InvalidRegistrationCode
} from '../../exceptions';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  constructor(
    private requester: HttpClient,
    private jwt: JwtHelperService,
    private user: UserService
  ) {
    this.checkIfValidTokenExists();
    const token = this.getToken();
    if (token != null) {
      try {
        this.user.SetUser(this.jwt.decodeToken(token));
      } catch (err) {
        this.user.SetUser(null);
      }
    }
  }

  public checkIfValidTokenExists() {
    const token = this.getToken();
    try {
      if (this.jwt.isTokenExpired(token)) {
        this.removeToken();
      }
    } catch {
      this.removeToken();
    }
  }

  public getToken(): string {
    if (localStorage.getItem('token') != null) {
      return localStorage.getItem('token');
    }
    if (sessionStorage.getItem('token') != null) {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  public registerUser(
    username: string,
    password: string,
    email: string,
    fname: string,
    lname: string,
    code: string
  ) {
    code = code == '' ? null : code;
    return this.requester
      .post(
        apiURL + '/register?l=web',
        {
          username: username,
          password: password,
          email: email,
          fname: fname,
          lname: lname,
          code: code
        },
        { observe: 'response' }
      )
      .pipe(
        catchError(res => {
          switch (res.status) {
            case 426:
              throw new InvalidRegistrationCode();
            case 409:
              switch (res.error['data']['duplicate']) {
                case 'username':
                  console.log('Username already in use');
                  throw new UsernameAlreadyInUseError();
                case 'email':
                  throw new EmailAlreadyInUseError();
                default:
                  throw new Error();
              }
              break;
            default:
              throw new Error();
              break;
          }
        })
      );
  }

  public loginUser(loginForm: { username: string; password: string }) {
    return this.requester
      .post(
        apiURL + '/login',
        {
          username: loginForm.username,
          password: loginForm.password
        },
        { observe: 'response' }
      )
      .pipe(
        map(res => {
          return res.body;
        }),
        catchError(res => {
          switch (res.status) {
            case 401:
              throw new InvalidPasswordError();
            case 404:
              throw new UserNotFoundError();
              break;
            default:
              throw new Error();
          }
        })
      );
  }

  public logoutUser() {
    try {
      this.user.SetUser(null);
      this.removeToken();
    } catch {
      throw new CouldntLogoutError();
    }
  }

  private removeToken() {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    } catch (err) {
      console.error(err);
    }
  }
  private savePermanentToken(token) {
    localStorage.setItem('token', token);
  }
  private saveTemporaryToken(token) {
    sessionStorage.setItem('token', token);
  }
  public storeUser(token, rememberMe: boolean) {
    if (rememberMe) {
      this.savePermanentToken(token);
    } else {
      this.saveTemporaryToken(token);
    }
    this.user.SetUser(this.jwt.decodeToken(token));
  }

  public DecodeToken(token) {
    return this.jwt.decodeToken(token);
  }
}
