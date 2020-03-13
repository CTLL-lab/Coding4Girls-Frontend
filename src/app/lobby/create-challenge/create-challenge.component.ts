import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/authentication/services/user/user.service';
import {
  ChallengeService,
  NoQuestionsDefinedError
} from '../services/challenge/challenge.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { forkJoin, BehaviorSubject, Subscription } from 'rxjs';
import { MinigameService } from '../minigames/minigame.service';
import { MinigameItem } from '../minigames/minigame-item';
import { FormGroup, FormBuilder, Form, FormArray } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { fully_priviledged_roles } from 'src/app/config';
import { SnapService } from 'src/app/shared/snap/snap.service';
import { QuillService } from 'src/app/shared/quill/quill.service';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css'],
  providers: [ChallengeService]
})
export class CreateChallengeComponent implements OnInit, OnDestroy {
  public worldBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public worldSubscription: Subscription;

  public role: string;
  public currentDate: Date = new Date();
  public pageTitle: string;

  public lobbyID = this.route.snapshot.paramMap.get('id');
  public challengeID = this.route.snapshot.paramMap.get('id');

  public name: string;
  public description: string;
  public canUpdate: Boolean;

  public currentLevelEditing;
  public currentSnapModalIsTemplate = true;

  public levels: FormArray;
  public removedLevels = [];

  public MiniGames = [];
  public currentMinigame: number;
  public minigameVariables = [];
  public challengeMinigameVariables = {};
  mode: string;
  public minigameType: string;
  public MiniGameHeaders: Array<string> = [];
  public MiniGameTags: Array<string> = [];
  public MiniGameCategories = this.minigamesService.MiniGamesCategories;
  public SelectableMiniGames = this.minigamesService.MiniGames.map(x => x.data);
  public tag: string;

  public htmlAfter = {};

  public selectedMiniGameCategory;

  public currentMinigameObject: MinigameItem;
  public currentMinigameForm: FormGroup;
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

  public canSaveAndDelete = false;
  constructor(
    private route: ActivatedRoute,
    public user: UserService,
    private challengeService: ChallengeService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private minigamesService: MinigameService,
    private modalService: BsModalService,
    private lobbyService: LobbyService,
    private snapService: SnapService,
    public quillService: QuillService,
    private fb: FormBuilder
  ) {
    this.worldBehaviorSubject = window['world'];
    this.MiniGameTags = this.minigamesService.MiniGameTags;
    this.MiniGameCategories = this.minigamesService.getMinigamesCategories();
    for (let key in this.MiniGameCategories) {
      this.MiniGameHeaders.push(key);
    }
    this.levels = this.fb.array([]);
  }

  ngOnInit() {
    if (this.route.snapshot.url[2].toString() == 'edit') {
      this.mode = 'edit';
      this.pageTitle = 'edit-team.1';
    } else {
      this.levels.push(this.createNewLevel());
      this.mode = 'create';
      this.pageTitle = 'create-team.1';
    }
    this.populateComponent(this.mode);
  }

  public createNewLevel(
    instructions = '',
    snap = '',
    snapSolution = '',
    id = null,
    solutionEnabled = true
  ): FormGroup {
    let order;
    try {
      order = this.levels.length + 1;
    } catch {
      order = 1;
    }
    return this.fb.group({
      id: id,
      instructions: instructions,
      snap: snap,
      snapSolution: snapSolution,
      solutionEnabled: solutionEnabled,
      order: order
    });
  }

  ngOnDestroy() {
    if (this.worldSubscription && !this.worldSubscription.closed) {
      this.worldSubscription.unsubscribe();
    }
  }

  changeMinigame(id: number) {
    this.currentMinigame = id;
    this.minigameVariables = this.SelectableMiniGames.find(
      x => x.id == id
    ).variables;
    this.minigameType = this.SelectableMiniGames.find(x => x.id == id).type;
    if (this.minigameVariables == undefined) {
      this.minigameVariables = [];
    }
    this.currentMinigameObject = this.minigamesService.getMinigameItemByID(id);
    this.currentMinigameForm = this.minigamesService.getMinigameByIDAsFormGroup(
      id
    );
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
    this.challengeService.GetChallengeLevels(this.challengeID).subscribe(x => {
      const incomingLevels = x['data']['levels'].sort((a, b) => a.ord - b.ord);
      incomingLevels.forEach(x => {
        this.levels.push(
          this.createNewLevel(
            x['instructions'] ? JSON.stringify(x['instructions']) : '',
            x['snap'] || '',
            x['snap_solution'] || '',
            x['id'],
            x['solution_enabled']
          )
        );
      });
    });

    this.challengeService.getTeamDetails(this.challengeID).subscribe(x => {
      this.name = x['data']['challenge']['name'];
      this.description = x['data']['challenge']['description'];
      this.currentMinigame = Number(x['data']['challenge']['minigame']);
      this.lobbyID = x['data']['challenge']['lobbyid'];
      this.challengeMinigameVariables = x['data']['challenge']['variables'];
      this.tag = x['data']['challenge']['tag'];
      this.checkIfCanSaveAndDelete();

      for (let key in this.MiniGameCategories) {
        for (let category of this.MiniGameCategories[key]) {
          if (
            category.categoryName == x['data']['challenge']['minigame_category']
          ) {
            this.selectMiniGameCategory(category, this.currentMinigame);
            if (!this.challengeMinigameVariables) {
              this.challengeMinigameVariables = {};
            }
            return;
          }
        }
      }
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
    this.checkIfCanSaveAndDelete();
  }
  checkIfCanSaveAndDelete() {
    if (this.lobbyID) {
      this.lobbyService.getLobbyDetails(this.lobbyID).subscribe(x => {
        const lobby = x['data']['lobby'];
        if (
          lobby.createdby == this.user.GetUserID() ||
          fully_priviledged_roles.includes(this.user.getRole())
        ) {
          this.canSaveAndDelete = true;
        }
      });
    }
  }
  canUpdateInfo() {
    this.canUpdate = true;
  }

  editTeam() {
    // check our current form
    if (this.currentMinigameForm) {
      this.currentMinigameForm.updateValueAndValidity();
      if (!this.currentMinigameForm.valid) {
        console.log(this.currentMinigameForm);
        this.notifications.showError('');
        return;
      }
    }
    try {
      const observables = [
        this.challengeService.editTeamInfo(
          this.challengeID,
          this.name,
          this.description,
          this.selectedMiniGameCategory['categoryName'] == 'None'
            ? null
            : this.currentMinigame,
          this.selectedMiniGameCategory['categoryName'] == 'None'
            ? null
            : this.currentMinigameForm.value,
          this.selectedMiniGameCategory.categoryName,
          this.tag
        )
      ];
      this.levels.value.map(x => {
        console.log(x);
        if (x.id) {
          observables.push(
            this.challengeService.EditChallengeLevel(this.challengeID, x)
          );
        } else {
          observables.push(
            this.challengeService.CreateChallengeLevel(this.challengeID, x)
          );
        }
      });

      this.removedLevels.map(x => {
        console.log(x);

        if (x.id) {
          observables.push(
            this.challengeService.DeleteChallengeLevel(this.challengeID, x)
          );
        }
      });

      console.log(observables);
      forkJoin(observables).subscribe(x => {
        this.storePreferences();
        this.notifications.showSuccess('');
        this.router.navigate(['/lobby/' + this.lobbyID]);
      });
    } catch (err) {
      if (err instanceof NoQuestionsDefinedError) {
        this.translationService.get('in-code.27').subscribe(k => {
          this.notifications.showError(k);
        });
      } else {
        this.translationService.get('in-code.3').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    }
  }

  createTeam() {
    try {
      this.challengeService
        .createNewTeam(
          this.name,
          this.description,
          this.lobbyID,
          this.selectedMiniGameCategory['categoryName'] == 'None'
            ? null
            : this.currentMinigame,
          this.selectedMiniGameCategory['categoryName'] == 'None'
            ? {}
            : this.currentMinigameForm.value,
          this.selectedMiniGameCategory.categoryName,
          this.tag
        )
        .subscribe(r => {
          if (r.status == 201) {
            const observables = [];

            this.levels.value.map(x => {
              console.log(x);
              observables.push(
                this.challengeService.CreateChallengeLevel(r.body as string, x)
              );
            });
            forkJoin(observables).subscribe(() => {
              this.translationService.get('in-code.2').subscribe(k => {
                this.notifications.showSuccess(k);
              });
              this.storePreferences();
              this.router.navigate(['/lobby/' + this.lobbyID]);
            });
          } else {
            this.translationService.get('in-code.3').subscribe(k => {
              this.notifications.showError(k);
            });
          }
        });
    } catch (err) {
      if (err instanceof NoQuestionsDefinedError) {
        this.translationService.get('in-code.27').subscribe(k => {
          this.notifications.showError(k);
        });
      } else {
        this.translationService.get('in-code.3').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    }
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

  selectMiniGameCategory(category: object, miniGameID?: number) {
    this.selectedMiniGameCategory = category;

    if (category['categoryName'] == 'None') {
      return;
    }
    this.MiniGames = [];
    for (let minigame of category['miniGames']) {
      this.MiniGames.push(this.SelectableMiniGames.find(x => x.id == minigame));
    }
    this.changeMinigame(miniGameID ? miniGameID : this.MiniGames[0].id);
  }

  addVariable() {
    this.minigameVariables.push([]);
  }

  deleteChallenge() {
    this.challengeService.deleteChallenge(this.challengeID).subscribe(
      x => {
        this.closeAllModals();
        this.notifications.showSuccess('');
        this.goBack();
      },
      x => {
        this.notifications.showError('');
      }
    );
  }

  showModal(
    modalToShow: TemplateRef<any>,
    options: { size: string; backdrop: boolean | 'static' } = {
      size: null,
      backdrop: true
    }
  ) {
    this.modalService.show(modalToShow, {
      class: 'modal-' + options.size,
      backdrop: options.backdrop
    });
  }

  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    document.body.classList.remove('modal-open');
  }

  saveInstructionsForCurrentLevel() {
    this.levels
      .at(this.currentLevelEditing)
      .get('instructions')
      .setValue(JSON.stringify(this.quillService.currentInstructions));
    this.quillService.currentInstructions = null;
  }

  prepareToOpenInstructionsModal() {
    try {
      this.quillService.currentInstructions =
        this.levels.at(this.currentLevelEditing).get('instructions').value != ''
          ? JSON.parse(
              this.levels.at(this.currentLevelEditing).get('instructions').value
            )
          : '';
    } catch (err) {
      console.log(err);
    }
  }

  saveSnapForCurrentLevel() {
    let controlName;
    if (this.currentSnapModalIsTemplate) {
      controlName = 'snap';
    } else {
      controlName = 'snapSolution';
    }

    this.levels
      .at(this.currentLevelEditing)
      .get(controlName)
      .setValue(this.snapService.GetCurrentSnapData());
  }

  loadSnap() {
    this.snapService.LoadProject(
      this.levels
        .at(this.currentLevelEditing)
        .get(this.currentSnapModalIsTemplate ? 'snap' : 'snapSolution').value
    );
  }
}
