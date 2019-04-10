import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { Router } from '@angular/router';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { priviledged_roles } from 'src/app/config';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css'],
  providers: [LobbyService]
})
export class CreateLobbyComponent implements OnInit {
  public lobbyDetails = {
    name: '',
    description: '',
    outcome: '',
    code: ''
  };
  public role: string;
  public userPriviledged = false;
  public invalidData = [];
  constructor(
    private lobbyService: LobbyService,
    private userService: UserService,
    private router: Router,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {}

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
          this.invalidData = err.error.data.map(x => {
            return x.param;
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
