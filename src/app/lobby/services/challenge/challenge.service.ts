import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { apiURL } from 'src/app/config';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Level } from 'src/app/teamModel';

export class NoQuestionsDefinedError implements Error {
  name: string;
  message: string;
  stack?: string;
  constructor() {
    this.name = 'NoQuestionsDefinedError';
    this.message = 'You did not define any questions when you must';
  }
}

@Injectable()
export class ChallengeService {
  constructor(private http: HttpClient, private userService: UserService) {}

  createNewTeam(
    challengeName: string,
    challengeDescription: string,
    lobbyId: string,
    minigame: number,
    minigamevariables: Object,
    minigameCategory: string,
    tag: string
  ) {
    if (minigamevariables['timer'] == '') {
      minigamevariables['timer'] = '180';
    }
    if (minigamevariables['opfamily'] == '') {
      minigamevariables['opfamily'] = 'basicop';
    }
    if (minigamevariables['questions']) {
      if (minigamevariables['questions'].length == 0) {
        throw new NoQuestionsDefinedError();
      }
    }
    if (tag == 'None') {
      tag = null;
    }
    return this.http.post(
      apiURL + '/challenges',
      {
        name: challengeName,
        description: challengeDescription,
        lobbyid: lobbyId,
        minigame: minigame,
        variables: minigamevariables,
        miniGameCategory: minigameCategory,
        tag: tag
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
    minigameCategory: string,
    tag: string
  ) {
    if (minigamevariables != null) {
      if (minigamevariables['timer'] == '') {
        minigamevariables['timer'] = '180';
      }
      if (minigamevariables['opfamily'] == '') {
        minigamevariables['opfamily'] = 'basicop';
      }
      if (minigamevariables['questions']) {
        if (minigamevariables['questions'].length == 0) {
          return;
        }
      }
    }
    if (tag == 'None') {
      tag = null;
    }
    return this.http
      .put(
        apiURL + '/challenges/' + challengeID,
        {
          name: challengeName,
          description: challengeDescription,
          minigame: minigame,
          variables: minigamevariables,
          miniGameCategory: minigameCategory,
          tag: tag
        },
        { observe: 'response' }
      )
      .pipe(map(x => x.body));
  }

  deleteChallenge(challengeID: string) {
    return this.http
      .delete(apiURL + '/challenges/' + challengeID, { observe: 'response' })
      .pipe(
        map(x => {
          x.body;
        })
      );
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

  GetChallengePage(challengeID: string, levelID: string) {
    return this.http
      .get(
        apiURL + '/challenges/' + challengeID + '/levels/' + levelID + '/page',
        {
          observe: 'response'
        }
      )
      .pipe(map(x => x.body));
  }

  EditChallengePage(challengeID: string, pageAfter: any) {
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

  GetChallengeSnapSolutionFromUser(
    challengeID: string,
    levelID: string,
    userID: string
  ) {
    return this.http
      .get(
        apiURL +
          '/users/' +
          userID +
          '/challenges/' +
          challengeID +
          '/solution/' +
          levelID,
        {
          observe: 'response'
        }
      )
      .pipe(map(x => x.body));
  }

  GetChallengeLevels(challengeID: string) {
    return this.http
      .get(apiURL + '/challenges/' + challengeID + '/levels', {
        observe: 'response'
      })
      .pipe(map(x => x.body));
  }

  EditChallengeLevel(challengeID: string, level: any) {
    return this.http
      .put(
        apiURL + '/challenges/' + challengeID + '/levels/' + level.id,
        level,
        { observe: 'response' }
      )
      .pipe(map(x => x.body));
  }

  DeleteChallengeLevel(challengeID: string, level: any) {
    return this.http
      .delete(apiURL + '/challenges/' + challengeID + '/levels/' + level.id, {
        observe: 'response'
      })
      .pipe(map(x => x.body));
  }

  CreateChallengeLevel(challengeID: string, level: any) {
    return this.http
      .post(apiURL + '/challenges/' + challengeID + '/levels', level, {
        observe: 'response'
      })
      .pipe(map(x => x.body));
  }
}
