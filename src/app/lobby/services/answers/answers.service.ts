import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from 'src/app/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {
  constructor(private http: HttpClient) {}

  GetLobbySolutions(lobbyID: string) {
    return this.http
      .get(apiURL + '/lobbies/' + lobbyID + '/solutions', {
        observe: 'response'
      })
      .pipe(
        map(x => {
          return x.body;
        })
      );
  }

  GetLobbyChallengesSolutions(lobbyID: string) {
    return this.http
      .get(apiURL + '/lobbies/' + lobbyID + '/challenges/solutions', {
        observe: 'response'
      })
      .pipe(
        map(x => {
          return x.body;
        })
      );
  }

  GetLobbySolutionForUser(userID: string, lobbyID: string) {
    return this.http
      .get(apiURL + '/users/' + userID + '/lobbies/' + lobbyID + '/solution', {
        observe: 'response'
      })
      .pipe(
        map(x => {
          return x.body;
        })
      );
  }
}
