import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/authentication/services/user/user';
import { priviledged_roles } from 'src/app/config';
import { BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.css'],
  providers: [LobbyService]
})
export class LobbiesComponent implements OnInit {
  public lobbiesJoined: Array<any> = new Array();
  public showSuccessAlert = false;
  public role: string = null;
  public user: User;
  public userPriviledged = false;
  public LobbyCloneForm: FormGroup;
  constructor(
    private userService: UserService,
    private lobbyService: LobbyService,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userService.user.subscribe(x => {
      this.user = x;
      this.grabLobbies();
      this.role = this.userService.getRole();
      this.userPriviledged = priviledged_roles.includes(this.role);
    });
    this.LobbyCloneForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      code: ['']
    });
  }

  grabLobbies() {
    this.lobbyService.getUserLobbies().subscribe(r => {
      this.lobbiesJoined = r['data']['lobbies'];
    });
  }
  joinLobby(code: string) {
    this.userService.JoinLobbyByCode(code).subscribe(
      r => {
        this.translationService.get('in-code.6').subscribe(k => {
          this.notifications.showSuccess(k);
        });
        this.grabLobbies();
      },
      r => {
        switch (r.status) {
          case 404:
            this.translationService.get('in-code.15').subscribe(k => {
              this.notifications.showError(k);
            });
            break;
          case 409:
            this.translationService.get('in-code.16').subscribe(k => {
              this.notifications.showError(k);
            });
            break;
          default:
            this.translationService.get('in-code.3').subscribe(k => {
              this.notifications.showError(k);
            });
            break;
        }
      }
    );
  }

  showLobby(lobbyID: string) {
    // pass
  }

  removeLobby(lobby: any) {
    this.userService.RemoveUserFromLobby(lobby.id).subscribe(
      r => {
        if (r.status == 200) {
          this.translationService.get('in-code.8').subscribe(k => {
            this.notifications.showSuccess(k);
          });
          this.grabLobbies();
        }
      },
      err => {
        this.translationService.get('in-code.7').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    );
  }

  CloneCourse() {
    const lobby = this.LobbyCloneForm.value;
    this.lobbyService
      .CloneLobby(lobby.id, lobby.name, lobby.description, lobby.code)
      .subscribe(
        x => {
          this.notifications.showSuccess('');
          this.grabLobbies();
        },
        err => {
          if (err.status == 201) {
            this.notifications.showSuccess('');
            this.closeAllModals();
            this.grabLobbies();
          } else {
            this.notifications.showError('');
          }
        }
      );
  }

  showModal(modalToShow: TemplateRef<any>) {
    this.modalService.show(modalToShow);
  }

  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    document.body.classList.remove('modal-open');
  }
}
