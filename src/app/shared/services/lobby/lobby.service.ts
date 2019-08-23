import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from 'src/app/config';
import { map } from 'rxjs/operators';

@Injectable()
export class LobbyService {
  constructor(private http: HttpClient) {}

  getUserLobbies(userID?: string) {
    if (userID != undefined) {
      return this.http
        .get(apiURL + '/users/' + userID + '/lobbies', {
          observe: 'response'
        })
        .pipe(map(x => x.body));
    }
    console.log('fetching /me/lobbies');
    return this.http
      .get(apiURL + '/me/lobbies', { observe: 'response' })
      .pipe(map(x => x.body));
  }

  getLobbyMembers(lobbyID: string) {
    return this.http
      .get(apiURL + '/lobbies/' + lobbyID + '/members', { observe: 'response' })
      .pipe(map(x => x.body));
  }

  getLobbyDetails(lobbyID: string) {
    return this.http.get(apiURL + '/lobbies/' + lobbyID);
  }

  GetLobbyChallenges(lobbyID: string) {
    return this.http.get(apiURL + '/lobbies/' + lobbyID + '/challenges');
  }

  lockLobby(lobbyID: string) {
    return this.http.put(apiURL + '/lobbies/' + lobbyID + '/lock', {});
  }

  unlockLobby(lobbyID: string) {
    return this.http.put(apiURL + '/lobbies/' + lobbyID + '/unlock', {});
  }

  createNewLobby(lobbyObject: any) {
    // TODO
    lobbyObject = { ...lobbyObject, snapTemplate: '' };

    return this.http.post(apiURL + '/lobbies', lobbyObject, {
      observe: 'response'
    });
  }

  saveLobbySettings(lobby: any) {
    const lobbyObject = { ...lobby };
    delete lobbyObject.teams;
    return this.http.put(
      apiURL + '/lobbies/' + lobbyObject['id'],
      lobbyObject,
      { observe: 'response' }
    );
  }

  ChangeChallengeOrderForLobby(
    lobbyID: string,
    challengesOrder: Array<number>
  ) {
    return this.http
      .put(
        apiURL + '/lobbies/' + lobbyID + '/challenges/order',
        { order: challengesOrder },
        { observe: 'response' }
      )
      .pipe(map(x => x.body));
  }

  GetLobbySnapTemplate(lobbyID: string) {
    return this.http
      .get(apiURL + '/lobbies/' + lobbyID + '/snap', { observe: 'response' })
      .pipe(map(x => x.body));
  }

  GetLobbyInstructionsPage(lobbyID: string) {
    return this.http
      .get(apiURL + '/lobbies/' + lobbyID + '/page', { observe: 'response' })
      .pipe(map(x => x.body));
  }

  EditLobbySnapTemplate(lobbyID: string, snap: string) {
    return this.http
      .put(
        apiURL + '/lobbies/' + lobbyID + '/snap',
        { snapTemplate: snap },
        { observe: 'response' }
      )
      .pipe(map(x => x.body));
  }

  EditLobbyInstructionsPage(lobbyID: string, page: Object) {
    return this.http
      .put(
        apiURL + '/lobbies/' + lobbyID + '/page',
        { pageAfter: page },
        { observe: 'response' }
      )
      .pipe(map(x => x.body));
  }
}
