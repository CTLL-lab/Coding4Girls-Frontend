import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { ChallengeService } from '../services/challenge/challenge.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { MiniGamesObject } from './minigametags';

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css'],
  providers: [ChallengeService]
})
export class CreateChallengeComponent implements OnInit {
  public numberOfLevels: number;
  public levelNames: Array<any>;
  public role: string;
  public currentDate: Date = new Date();

  public lobbyID = this.route.snapshot.paramMap.get('id');
  public challengeID = this.route.snapshot.paramMap.get('id');
  public areDatesValid: boolean;
  public name: string;
  public description: string;
  public canUpdate: Boolean;
  public minigames = [];
  public currentMinigame: string;
  public minigameVariables = [];
  public challengeMinigameVariables = {};
  mode: string;

  public MiniGameCategories: Array<string> = [];
  public MiniGamesObject = MiniGamesObject;
  constructor(
    private route: ActivatedRoute,
    public user: UserService,
    private challengeService: ChallengeService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {
    for (let key in MiniGamesObject) {
      this.MiniGameCategories.push(key);
    }
  }

  ngOnInit() {
    if (this.route.snapshot.url[2].toString() == 'edit') {
      this.mode = 'edit';
    } else {
      this.mode = 'create';
    }
    this.challengeService.GetMiniGames().subscribe(x => {
      this.minigames = x['data']['mini_games'];
    });
    this.populateComponent(this.mode);
  }
  changeMinigame(value: string) {
    this.currentMinigame = value;
    this.challengeService.GetMiniGameDetails(value).subscribe(x => {
      console.log(x);
      this.minigameVariables = x['data']['mini_game']['variables'];
    });
  }
  populateComponent(mode: string) {
    console.log('Populating component');
    switch (mode) {
      case 'edit':
        this.populateComponentForEdit();
        break;
      case 'create':
      default:
        this.populateComponentForCreate();
        break;
    }
  }

  populateComponentForEdit() {
    this.challengeService.getTeamDetails(this.challengeID).subscribe(x => {
      console.log(x);
      this.name = x['data']['challenge']['name'];
      this.description = x['data']['challenge']['description'];
      this.currentMinigame = x['data']['challenge']['minigame'];
      this.lobbyID = x['data']['challenge']['lobbyid'];
      this.challengeMinigameVariables = x['data']['challenge']['variables'];
      if (this.challengeMinigameVariables == null) {
        this.challengeMinigameVariables = {};
      }
      this.changeMinigame(this.currentMinigame);
    });
  }
  populateComponentForCreate() {
    try {
      const preferences = JSON.parse(
        localStorage.getItem('challenge-preferences-' + this.lobbyID)
      );
      this.name = preferences['name'];
      this.description = preferences['description'];
    } catch {
      this.name = '';
      this.description = '';
    }
  }

  canUpdateInfo() {
    this.canUpdate = true;
  }

  editTeam() {
    this.challengeService
      .editTeamInfo(
        this.challengeID,
        this.name,
        this.description,
        this.currentMinigame,
        this.challengeMinigameVariables
      )
      .subscribe(x => {
        this.storePreferences();
        this.router.navigate(['/lobby/' + this.lobbyID]);
      });
  }

  createTeam() {
    this.challengeService
      .createNewTeam(
        this.name,
        this.description,
        this.lobbyID,
        this.currentMinigame,
        this.challengeMinigameVariables
      )
      .subscribe(r => {
        if (r.status == 201) {
          this.translationService.get('in-code.2').subscribe(k => {
            this.notifications.showSuccess(k);
          });
          this.storePreferences();
          this.router.navigate(['/lobby/' + this.lobbyID]);
        } else {
          this.translationService.get('in-code.3').subscribe(k => {
            this.notifications.showError(k);
          });
        }
      });
  }
  storePreferences() {
    localStorage.setItem(
      'challenge-preferences-' + this.lobbyID,
      JSON.stringify({
        name: this.name,
        description: this.description
      })
    );
  }
  goBack() {
    this.router.navigateByUrl('/lobby/' + this.lobbyID);
  }

  selectMiniGameCategory(category: object) {
    this.minigames = category['miniGames'];
    console.log(this.minigames);
  }
}
