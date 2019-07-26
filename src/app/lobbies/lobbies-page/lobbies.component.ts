import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/authentication/services/user/user';
import { priviledged_roles } from 'src/app/config';

@Component({
  selector: 'app-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.css'],
  providers: [LobbyService]
})
export class LobbiesComponent implements OnInit {
  private socket;
  public lobbiesJoined: Array<any> = new Array();
  public showSuccessAlert = false;
  public role: string = null;
  public user: User;
  public userPriviledged = false;
  constructor(
    private userService: UserService,
    private lobbyService: LobbyService,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {}

  ngOnInit() {
    this.userService.user.subscribe(x => {
      this.user = x;
      this.grabLobbies();
      this.role = this.userService.getRole();
      this.userPriviledged = priviledged_roles.includes(this.role);
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
            this.translationService.get('in-code.7').subscribe(k => {
              this.notifications.showError(k);
            });
            break;
          case 409:
            this.translationService.get('in-code.7').subscribe(k => {
              this.notifications.showError(k);
            });
            break;
          default:
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
}
