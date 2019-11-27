import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from 'src/app/core/navbar/navbar.service';
import { ActivatedRoute } from '@angular/router';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { ChallengeService } from '../services/challenge/challenge.service';
import { Subscription, BehaviorSubject, Observable, Subject } from 'rxjs';
import { AnswersService } from '../services/answers/answers.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';

@Component({
  selector: 'app-viewpage',
  templateUrl: './viewpage.component.html',
  styleUrls: ['./viewpage.component.css']
})

// Accepted query params for this component
// t <- type of the page to show
//    instructions <- load lobby or challenge instructions
//    snap <- load snap for lobby or challenge
//    canvas <- load brainstorm canvas (only lobby)
// lid <- lobby ID
// cid <- challenge ID
export class ViewpageComponent implements OnInit, OnDestroy {
  public lobbyID: string;
  public challengeID: string;
  public levelID: string;
  public type: string;

  // Quill
  public quillContent = {};
  public quillModules = {
    toolbar: false,
    imageResize: {
      modules: false
    }
  };

  // Snap
  public world: BehaviorSubject<any> = new BehaviorSubject(null);
  public snapTemplate = null;
  private worldSubscription: Subscription;
  public savePressed: Subject<number> = new Subject();

  constructor(
    private nav: NavbarService,
    private route: ActivatedRoute,
    private lobby: LobbyService,
    private challenge: ChallengeService,
    private answers: AnswersService,
    private notifications: NotificationsToasterService
  ) {
    window['world'] = this.world;
    this.nav.hide();
  }

  ngOnDestroy() {
    if (this.worldSubscription && !this.worldSubscription.closed) {
      this.worldSubscription.unsubscribe();
    }
    this.savePressed.unsubscribe();
  }

  ngOnInit() {
    // store all the parameters
    const params = this.route.snapshot.queryParams;
    if (params.t) {
      this.type = params.t;
    }
    if (params.lid) {
      this.lobbyID = params.lid;
    }
    if (params.lid == undefined && params.cid) {
      this.challengeID = params.cid;
      this.levelID = params.lvl;
    }

    // the observable we will call
    let obs: Observable<any>;

    // If we want to show instructions
    if (this.type == 'instructions') {
      if (params.lid) {
        obs = this.lobby.GetLobbyInstructionsPage(params.lid);
      } else if (params.cid) {
        obs = this.challenge.GetChallengePage(params.cid, params.lvl);
      }
      obs.subscribe(x => {
        this.quillContent = x;
      });
    } else if (this.type == 'snap') {
      // if we want to show snap

      // a subject that listens for a value emitted
      // probably from unity browser so we can save
      // the progress of the user
      window['savePressed'] = this.savePressed;
      // if we have a new value we know the user wants
      // to save his progress
      this.savePressed.subscribe(x => {
        let obs: Observable<any>;
        if (this.lobbyID) {
          console.log('im sending lobby');
          obs = this.answers.SubmitLobbySolutionForSelf(
            this.lobbyID,
            this.getSnapContent()
          );
        } else if (this.challengeID) {
          console.log('im sending challenge');

          obs = this.answers.SubmitChallengeSolutionForSelf(
            this.challengeID,
            this.getSnapContent()
          );
        }
        obs.subscribe(
          x => {
            this.notifications.showSuccess('');
          },
          x => {
            if (x.status == 201) {
              this.notifications.showSuccess('');
            } else {
              this.notifications.showError('');
            }
          }
        );
      });

      if (params.lid) {
        obs = this.lobby.GetLobbySnapTemplate(params.lid);
      } else if (params.cid) {
        obs = this.challenge.GetChallengeSnap(params.cid);
      }
      obs.subscribe(x => {
        this.worldSubscription = this.world.subscribe(y => {
          if (y == null) {
            return;
          }
          if (x == '') {
            return;
          }
          y.children[0].rawOpenProjectString(x);
        });
      });
    }
  }

  getSnapContent() {
    // Get Snap instance
    const world = this.world.value;

    // If not initiated yet, we wait
    // because this code runs when the user clicks the Save button
    // in edit team
    if (world == null) {
      return;
    }

    let snapTemplateXML: string;

    if (this.isSnapCanvasEmpty(world)) {
      // Snap will produce some xml even with no blocks
      // so to save space in database we store an empty string
      snapTemplateXML = '';
    } else {
      snapTemplateXML = world.children[0].serializer.serialize(
        world.children[0].stage
      );
    }
    return snapTemplateXML;
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
