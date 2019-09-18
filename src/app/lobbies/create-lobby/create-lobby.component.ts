import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { Router } from '@angular/router';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { priviledged_roles } from 'src/app/config';
import { BehaviorSubject } from 'rxjs';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { NotesProviderService } from 'src/app/shared/canvas/notes/services/notes/notes-provider.service';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css'],
  providers: [LobbyService]
})
export class CreateLobbyComponent implements OnInit {
  public world: BehaviorSubject<any> = new BehaviorSubject(null);
  public lobbyDetails = {
    name: '',
    description: '',
    outcome: '',
    code: '',
    htmlAfter: null
  };
  public role: string;
  public userPriviledged = false;
  public invalidData = [];

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
    private lobbyService: LobbyService,
    private userService: UserService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private notesService: NotesProviderService
  ) {
    window['world'] = this.world;
  }

  ngOnInit() {
    this.userPriviledged = priviledged_roles.includes(
      this.userService.getRole()
    );
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

    this.lobbyService
      .createNewLobby({
        ...this.lobbyDetails,
        snapTemplate: snapTemplateXML,
        instructions: this.lobbyDetails.htmlAfter,
        notes: this.notesService.notes
      })
      .subscribe(
        r => {
          if (r.status == 201) {
            this.translationService.get('in-code.1').subscribe(k => {
              this.notifications.showSuccess(k);
            });
            this.router.navigateByUrl('/lobbies');
          }
        },
        err => {
          console.log(err);
          if (err.status == 422) {
            this.translationService
              .get('in-code.4')
              .toPromise()
              .then(m => {
                this.notifications.showError(m);
                this.invalidData = err.error.data.map(x => {
                  return x.param;
                });
              });
          }
          if (err.status == 400) {
            switch (err.error.data.errorCode) {
              case 'LOBBIES2':
                this.notifications.showError('Code already in use');
                this.invalidData = ['code'];
                break;
              default:
                break;
            }
          }
        }
      );
  }

  goBack() {
    window.history.back();
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
