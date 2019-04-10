import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from 'src/app/config';

@Injectable()
export class LobbyService {
  constructor(private http: HttpClient) {}

  getUserLobbies(userID: string) {
    return this.http.get(apiURL + '/users/' + userID + '/lobbies');
  }

  getLobbyMembers(lobbyID: string) {
    return this.http.get(apiURL + '/lobbies/' + lobbyID + '/members');
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
}
