import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { ChallengeBoxOptions } from '../challenge-box/challenge-box.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MinigameService } from '../minigames/minigame.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.css'],
  providers: []
})
export class LobbyPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private lobbyService: LobbyService,
    private router: Router,
    private modalService: BsModalService,
    public minigamesService: MinigameService,
    public notifications: NotificationsToasterService
  ) {
    this.SortableJSOptions = {
      onUpdate: (event: any) => {
        const challengesIDOrder: Array<number> = [];
        this.challenges.map(x => challengesIDOrder.push(x.id));
        this.lobbyService
          .ChangeChallengeOrderForLobby(this.id, challengesIDOrder)
          .subscribe(x => {});
      }
    };
  }
  public SortableJSOptions;
  public id: string;
  public lobbyDetails: any;
  public challenges = [];
  public members: Array<any>;

  public currentDraggingBox = -1;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lobbyService.getLobbyDetails(this.id).subscribe(r => {
      this.lobbyDetails = r['data']['lobby'];
    });
    this.lobbyService.GetLobbyChallenges(this.id).subscribe(r => {
      // first we store temporarily the challenges
      const challengesTemp = r['data']['challenges'];
      // and their order
      const challengesOrder = r['data']['order'];
      // and we recreate the challenges list based on this order
      if (challengesOrder != null) {
        for (let i of challengesOrder) {
          this.challenges.push(challengesTemp.find(x => x.id == i));
        }
      }
    });
    this.lobbyService.getLobbyMembers(this.id).subscribe(r => {
      this.members = r['data']['members'];
    });
  }

  openChallengeSettings(id: string) {
    this.router.navigateByUrl('/lobby/team/' + id + '/edit');
  }

  openSettings() {
    this.router.navigateByUrl('/lobby/' + this.id + '/settings');
  }

  canCreateTeam() {
    return true;
  }

  getTeamOptions(team): ChallengeBoxOptions {
    const teamOptions: ChallengeBoxOptions = {
      ShowBrainstormRequested: false,
      ShowChallengeNotVerified: false,
      ShowCompleted: false,
      ShowHelpAsked: false,
      ShowReviewRequested: false,
      MaxTeamSize: 0,
      UserMemberOfTeam: false,
      CanJoin: false,
      CanStart: false,
      CanView: false,
      CanStudentsView: false,
      CanVerify: false,
      HasNotEnoughMembers: false,
      IsUserPriviledged: false
    };
    return teamOptions;
  }

  showModal(modalToShow: TemplateRef<any>) {
    this.modalService.show(modalToShow);
  }

  deleteLobby() {
    this.lobbyService
      .DeleteLobby(this.lobbyDetails['id'].toString())
      .subscribe(x => {
        this.closeAllModals();
        this.notifications.showSuccess('');
        this.router.navigateByUrl('/lobbies');
      });
  }

  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    document.body.classList.remove('modal-open');
  }
}
