import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from 'src/app/config';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ChallengeService {
  constructor(private http: HttpClient, private userService: UserService) {}

  createNewTeam(
    challengeName: string,
    challengeDescription: string,
    lobbyId: string,
    minigame: number,
    minigamevariables: Object,
    snapTemplate: string,
    pageAfter: string,
    minigameCategory: string
  ) {
    return this.http.post(
      apiURL + '/challenges',
      {
        name: challengeName,
        description: challengeDescription,
        lobbyid: lobbyId,
        minigame: minigame,
        variables: minigamevariables,
        snapTemplate: snapTemplate,
        pageAfter: pageAfter,
        miniGameCategory: minigameCategory
      },
      { observe: 'response' }
    );
  }

  editTeamInfo(
    challengeID: string,
    challengeName: string,
    challengeDescription: string,
    minigame: number,
    minigamevariables: Object,
    minigameCategory: string
  ) {
    return this.http.put(
      apiURL + '/challenges/' + challengeID,
      {
        name: challengeName,
        description: challengeDescription,
        minigame: minigame,
        variables: minigamevariables,
        miniGameCategory: minigameCategory
      },
      { observe: 'response' }
    );
  }

  deleteTeam(teamID: string) {
    return this.http.delete(apiURL + '/teams/' + teamID);
  }

  getTeamMembers(teamID: string) {
    return this.http.get(apiURL + '/teams/' + teamID);
  }

  getTeamDetails(teamID: string) {
    return this.http.get(apiURL + '/challenges/' + teamID);
  }

  joinTeam(teamID: Number) {
    const userID = this.userService.GetUserID();
    return this.http.post(apiURL + '/users/' + userID + '/teams', {
      teamid: teamID
    });
  }

  leaveTeam(teamID: Number) {
    const userID = this.userService.GetUserID();
    return this.http.delete(apiURL + '/users/' + userID + '/teams/' + teamID);
  }

  changeTeamName(teamID: Number, newName: string) {
    return this.http.put(apiURL + '/teams/' + teamID, { name: newName });
  }

  verifyTeam(teamID: Number) {
    return this.http.put(apiURL + '/teams/' + teamID, {
      challengeverified: true
    });
  }

  askHelp(teamID: Number) {
    return this.http.post(apiURL + '/teams/' + teamID + '/help', {});
  }

  endHelp(teamID: Number) {
    return this.http.delete(apiURL + '/teams/' + teamID + '/help');
  }

  askReview(levelID: Number) {
    return this.http.put(apiURL + '/levels/' + levelID, {
      under_review: true
    });
  }

  askBrainstorm(teamID: Number) {
    return this.http.post(apiURL + '/teams/' + teamID + '/brainstorm', {});
  }
  endBrainstorm(teamID: Number) {
    return this.http.delete(apiURL + '/teams/' + teamID + '/brainstorm', {});
  }

  teamPass(levelID: Number) {
    return this.http.put(apiURL + '/levels/' + levelID + '/pass', {});
  }

  lockLevel(levelID: Number) {
    return this.http.put(apiURL + '/levels/' + levelID, {
      locked: true
    });
  }

  unlockLevel(levelID: Number) {
    return this.http.put(apiURL + '/levels/' + levelID, {
      locked: false
    });
  }

  completeLevel(levelID: Number) {
    return this.http.put(apiURL + '/levels/' + levelID, {
      completed: true
    });
  }

  teamFail(levelID: Number) {
    return this.http.put(apiURL + '/levels/' + levelID + '/fail', {});
  }

  changeEndDateOfLevel(levelID: Number, enddate: string) {
    return this.http.put(apiURL + '/levels/' + levelID, { enddate: enddate });
  }

  GetMiniGameDetails(MiniGameID: string) {
    return this.http.get(apiURL + '/mini_games/' + MiniGameID);
  }

  GetMiniGames() {
    return this.http.get(apiURL + '/mini_games');
  }

  GetChallengePage(challengeID: string) {
    return this.http
      .get(apiURL + '/challenges/' + challengeID + '/page', {
        observe: 'response'
      })
      .pipe(map(x => x.body));
  }

  EditChallengePage(challengeID: string, pageAfter: string) {
    return this.http
      .put(
        apiURL + '/challenges/' + challengeID + '/page',
        { page: pageAfter },
        {
          observe: 'response'
        }
      )
      .pipe(map(x => x.body));
  }

  GetChallengeSnap(challengeID: string) {
    return this.http
      .get(apiURL + '/challenges/' + challengeID + '/snap', {
        observe: 'response'
      })
      .pipe(map(x => x.body));
  }

  EditChallengeSnap(challengeID: string, snapTemplate: string) {
    return this.http
      .put(
        apiURL + '/challenges/' + challengeID + '/snap',
        { snapTemplate: snapTemplate },
        {
          observe: 'response'
        }
      )
      .pipe(map(x => x.body));
  }
}
