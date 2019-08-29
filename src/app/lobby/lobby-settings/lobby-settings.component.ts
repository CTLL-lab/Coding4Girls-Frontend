import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { priviledged_roles } from 'src/app/config';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-lobby-settings',
  templateUrl: './lobby-settings.component.html',
  styleUrls: ['./lobby-settings.component.css'],
  providers: [LobbyService]
})
export class LobbySettingsComponent implements OnInit {
  public world: BehaviorSubject<any> = new BehaviorSubject(null);

  public lobbyDetails = null;
  public id: string;
  public role: string;
  private lobbyDetailsOrig = null;
  public isUserPriviledged = false;

  // Snap
  public snapTemplate = null;
  private worldSubscription: Subscription;
  // Quill
  public htmlPage = {};
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
    private user: UserService,
    private route: ActivatedRoute,
    private lobbyService: LobbyService,
    private router: Router,
    public notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {
    window['world'] = this.world;
  }

  ngOnInit() {
    this.role = this.user.getRole();
    this.isUserPriviledged = priviledged_roles.includes(this.role);
    this.lobbyDetailsOrig = this.lobbyDetails;
    this.id = this.route.snapshot.paramMap.get('id');
    this.lobbyService.getLobbyDetails(this.id).subscribe(r => {
      this.lobbyDetails = r['data']['lobby'];
    });

    // Populate quill text editor
    this.lobbyService.GetLobbyInstructionsPage(this.id).subscribe(x => {
      console.log(x);
      this.htmlPage = x;
    });

    // Populate snap
    this.worldSubscription = this.world.subscribe(x => {
      if (x == null) {
        return;
      }
      this.lobbyService.GetLobbySnapTemplate(this.id).subscribe((y: string) => {
        if (y.startsWith('<project')) {
          x.children[0].rawOpenProjectString(y);
        }
      });
      this.worldSubscription.unsubscribe();
    });

    this.lobbyDetailsOrig = this.lobbyDetails;
  }
  goBack() {
    this.router.navigateByUrl('/lobby/' + this.id);
  }
  saveChanges() {
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
      world.children[0].setProjectName(this.lobbyDetails.name);
      snapTemplateXML = world.children[0].serializer.serialize(
        world.children[0].stage
      );
    }

    forkJoin([
      this.lobbyService.saveLobbySettings(this.lobbyDetails),
      this.lobbyService.EditLobbySnapTemplate(this.id, snapTemplateXML),
      this.lobbyService.EditLobbyInstructionsPage(this.id, this.htmlPage)
    ]).subscribe(
      r => {
        this.translationService.get('in-code.9').subscribe(k => {
          this.notifications.showSuccess(k);
        });
        this.goBack();
      },
      err => {
        this.translationService.get('in-code.3').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    );
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
