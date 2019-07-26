import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { ChallengeService } from '../services/challenge/challenge.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { MiniGamesCategories, MiniGames } from './minigametags';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { forkJoin, BehaviorSubject } from 'rxjs';

Quill.register('modules/imageResize', ImageResize);
@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css'],
  providers: [ChallengeService]
})
export class CreateChallengeComponent implements OnInit {
  public world: BehaviorSubject<any> = new BehaviorSubject(null);

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
  public MiniGames = [];
  public currentMinigame: number;
  public minigameVariables = [];
  public challengeMinigameVariables = {};
  mode: string;

  public MiniGameHeaders: Array<string> = [];
  public MiniGameCategories = MiniGamesCategories;
  public SelectableMiniGames = MiniGames;

  public htmlAfter = {};

  public selectedMiniGameCategory;

  public quillModules = {
    imageResize: {},
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video', 'formula'] // link and image, video
    ]
  };
  constructor(
    private route: ActivatedRoute,
    public user: UserService,
    private challengeService: ChallengeService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {
    window['world'] = this.world;
    for (let key in MiniGamesCategories) {
      this.MiniGameHeaders.push(key);
    }
  }

  ngOnInit() {
    if (this.route.snapshot.url[2].toString() == 'edit') {
      this.mode = 'edit';
    } else {
      this.mode = 'create';
    }
    this.populateComponent(this.mode);
  }

  changeMinigame(id: number) {
    this.currentMinigame = id;
    this.minigameVariables = this.SelectableMiniGames.find(
      x => x.id == id
    ).variables;
    if (this.minigameVariables == undefined) {
      this.minigameVariables = [];
    }
  }
  populateComponent(mode: string) {
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
      this.name = x['data']['challenge']['name'];
      this.description = x['data']['challenge']['description'];
      this.currentMinigame = Number(x['data']['challenge']['minigame']);
      this.lobbyID = x['data']['challenge']['lobbyid'];
      this.challengeMinigameVariables = x['data']['challenge']['variables'];
      this.world.subscribe(x => {
        if (x == null) {
          return;
        }
        this.challengeService
          .GetChallengeSnap(this.challengeID)
          .subscribe(y => {
            x.children[0].openProjectString(y);
          });
        // this.world.children[0].openProject('Spyros');
      });

      for (let key in MiniGamesCategories) {
        for (let category of this.MiniGameCategories[key]) {
          if (
            category.categoryName == x['data']['challenge']['minigame_category']
          ) {
            this.selectMiniGameCategory(category);
            this.changeMinigame(this.currentMinigame);
            if (this.challengeMinigameVariables == null) {
              this.challengeMinigameVariables = {};
            }
            return;
          }
        }
      }
    });
    this.challengeService.GetChallengePage(this.challengeID).subscribe(x => {
      this.htmlAfter = x;
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
    // Get Snap instance
    const world = this.world.value;

    // If not initiated yet, we wait
    if (world == null) {
      return;
    }

    let snapTemplateXML: string;

    if (this.isSnapCanvasEmpty(world)) {
      // Snap will produce some xml even with no blocks
      // so to save space in database we store an empty string
      snapTemplateXML = '';
    } else {
      world.children[0].setProjectName(this.name);
      snapTemplateXML = world.children[0].serializer.serialize(
        world.children[0].stage
      );
    }

    forkJoin([
      this.challengeService.editTeamInfo(
        this.challengeID,
        this.name,
        this.description,
        this.currentMinigame,
        this.challengeMinigameVariables,
        this.selectedMiniGameCategory.categoryName
      ),
      this.challengeService.EditChallengePage(
        this.challengeID,
        JSON.stringify(this.htmlAfter)
      ),
      this.challengeService.EditChallengeSnap(this.challengeID, snapTemplateXML)
    ]).subscribe(x => {
      this.storePreferences();
      this.router.navigate(['/lobby/' + this.lobbyID]);
    });
  }

  createTeam() {
    // Get Snap instance
    const world = this.world.value;

    // If not initiated yet, we wait
    if (world == null) {
      return;
    }

    let snapTemplateXML: string;

    if (this.isSnapCanvasEmpty(world)) {
      // Snap will produce some xml even with no blocks
      // so to save space in database we store an empty string
      snapTemplateXML = '';
    } else {
      world.children[0].setProjectName(this.name);
      snapTemplateXML = world.children[0].serializer.serialize(
        world.children[0].stage
      );
    }
    this.challengeService
      .createNewTeam(
        this.name,
        this.description,
        this.lobbyID,
        this.currentMinigame,
        this.minigameVariables,
        snapTemplateXML,
        JSON.stringify(this.htmlAfter),
        this.selectedMiniGameCategory.categoryName
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
    this.MiniGames = [];
    for (let minigame of category['miniGames']) {
      this.MiniGames.push(this.SelectableMiniGames.find(x => x.id == minigame));
    }
    this.changeMinigame(this.MiniGames[0].id);
    this.selectedMiniGameCategory = category;
  }

  // Takes the world as argument and uses the serializer
  // to find if the canvas is empty or not
  isSnapCanvasEmpty(a): boolean {
    // Load the current project to the serializer
    a.children[0].serializer.store(a.children[0].stage);
    const numberOfContents = a.children[0].serializer.contents.length;
    a.children[0].serializer.flush();
    // An empty project has 15 contents. So if we have 15, the user didn't add any blocks
    if (numberOfContents == 15) {
      return true;
    }
    return false;
  }
}
