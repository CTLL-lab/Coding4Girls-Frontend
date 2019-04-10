import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { priviledged_roles } from 'src/app/config';

@Component({
  selector: 'app-lobby-settings',
  templateUrl: './lobby-settings.component.html',
  styleUrls: ['./lobby-settings.component.css'],
  providers: [LobbyService]
})
export class LobbySettingsComponent implements OnInit {
  public lobbyDetails = null;
  private id: string;
  public role: string;
  private lobbyDetailsOrig = null;
  public isUserPriviledged = false;
  constructor(
    private user: UserService,
    private route: ActivatedRoute,
    private lobbyService: LobbyService,
    private router: Router,
    public notifications: NotificationsToasterService,
    private translationService: TranslateService
  ) {}

  ngOnInit() {
    this.role = this.user.getRole();
    this.isUserPriviledged = priviledged_roles.includes(this.role);
    this.lobbyDetailsOrig = this.lobbyDetails;
    this.id = this.route.snapshot.paramMap.get('id');
    this.lobbyService.getLobbyDetails(this.id).subscribe(r => {
      this.lobbyDetails = r['data']['lobby'];
    });
    this.lobbyDetailsOrig = this.lobbyDetails;
  }
  goBack() {
    this.router.navigateByUrl('/lobby/' + this.id);
  }
  saveChanges() {
    this.lobbyService.saveLobbySettings(this.lobbyDetails).subscribe(r => {
      if (r.status == 200) {
        this.translationService.get('in-code.9').subscribe(k => {
          this.notifications.showSuccess(k);
        });
        this.goBack();
      } else {
        this.translationService.get('in-code.3').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    });
  }
}
