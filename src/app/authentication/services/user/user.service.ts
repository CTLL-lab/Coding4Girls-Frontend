import { Injectable } from '@angular/core';
import { User } from './user';
import { BehaviorSubject } from 'rxjs';
import {
  fully_priviledged_roles,
  apiURL,
  priviledged_roles
} from 'src/app/config';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  public user: BehaviorSubject<User>;
  constructor(
    private translationService: TranslateService,
    private http: HttpClient
  ) {
    this.user = new BehaviorSubject<User>(null);
  }

  public SetUser(user: User) {
    this.user.next(user);
    if (user) {
      this.GetUserLanguage().subscribe(x => {
        localStorage.setItem('-snap-setting-language', x);
        this.translationService.use(x);
      });
    }
  }

  public IsUserFullyPriviledged(): boolean {
    if (this.user.value != null) {
      return fully_priviledged_roles.includes(this.user.value.role);
    }
    return false;
  }
  public IsUserPriviledged(): boolean {
    if (this.user.value != null) {
      return priviledged_roles.includes(this.user.value.role);
    }
    return false;
  }
  public getRole(): string {
    if (this.user.value != null) {
      return this.user.value.role;
    }
    return null;
  }

  public JoinLobbyByCode(code: string) {
    return this.http.post(
      apiURL + '/users/' + this.user.value.id + '/lobbies',
      { code: code },
      { observe: 'response' }
    );
  }
  public JoinLobbyByID(lobbyID: string) {}

  public RemoveUserFromLobby(lobbyID: string) {
    return this.http.delete(
      apiURL + '/users/' + this.user.value.id + '/lobbies/' + lobbyID,
      { observe: 'response' }
    );
  }

  public GetUserID() {
    return this.user.value != null ? this.user.value.id : null;
  }

  public GetUsername() {
    if (this.user.value != null) {
      return this.user.value.username;
    }
    return null;
  }

  public GetUserLanguage() {
    return this.http
      .get(apiURL + '/me/language')
      .pipe(map(x => x['data']['lang']));
  }

  public SetUserLanguage(lang: string) {
    localStorage.setItem('-snap-setting-language', lang);
    return this.http.post(apiURL + '/me/language', { lang });
  }
}
