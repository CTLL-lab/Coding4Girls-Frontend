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
    private translationService: TranslateService
  ) {
    window['world'] = this.world;
  }

  ngOnInit() {
    this.userPriviledged = priviledged_roles.includes(
      this.userService.getRole()
    );
  }
  saveChanges() {
    this.lobbyService.createNewLobby(this.lobbyDetails).subscribe(
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
}
