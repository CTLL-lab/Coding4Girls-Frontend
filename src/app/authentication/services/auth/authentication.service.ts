import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { apiURL } from '../../../config';
import { UserService } from '../user/user.service';

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
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('email', email)
      .set('fname', fname)
      .set('lname', lname)
      .set('code', code);
    return this.requester.post(
      apiURL + '/users/register',
      body,
      this.httpOptions
    );
  }

  public loginUser(username: string, password: string) {
    return this.requester.post(apiURL + '/login', {
      username: username,
      password: password
    });
  }

  public logoutUser() {
    this.user.SetUser(null);
    this.removeToken();
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
}
