import {
  Component,
  OnInit,
  ViewChild,
  AfterContentChecked,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { ChallengeService } from '../services/challenge/challenge.service';
import { ChallengeBoxOptions } from '../challenge-box/challenge-box.component';
import { priviledged_roles } from '../../config';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MinigameService } from '../minigames/minigame.service';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.css'],
  providers: []
})
export class LobbyPageComponent implements OnInit, AfterContentChecked {
  @ViewChild('settingsModel')
  settingsModel;
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private lobbyService: LobbyService,
    private router: Router,
    private challengeService: ChallengeService,
    private modalService: BsModalService,
    public minigamesService: MinigameService
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
  public newName: string;
  public showCompleted = false;
  public teamForModal;
  public challenges = [];
  items = [1, 2, 3, 4, 5];
  public members: Array<any>;

  public currentDraggingBox = -1;

  ngAfterContentChecked() {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lobbyService.getLobbyDetails(this.id).subscribe(r => {
      this.lobbyDetails = r['data']['lobby'];
      //   this.userService
      //     .getUsernameFromID(this.lobbyDetails.createdby)
      //     .subscribe(creator => {
      //       this.lobbyDetails.creatorusername = creator;
      //     });
    });
    this.lobbyService.GetLobbyChallenges(this.id).subscribe(r => {
      // first we store temporarily the challenges
      const challengesTemp = r['data']['challenges'];
      // and their order
      const challengesOrder = r['data']['order'];
      // and we recreate the challenges list based on this order
      for (let i of challengesOrder) {
        this.challenges.push(challengesTemp.find(x => x.id == i));
      }
      // this.challenges = r['data']['challenges'];
    });
    this.lobbyService.getLobbyMembers(this.id).subscribe(r => {
      console.log(r);
      this.members = r['data']['members'];
    });
  }

  lockLobby() {
    this.lobbyService.lockLobby(this.id).subscribe(r => {
      if (r['success']) {
        this.lobbyDetails.locked = true;
      }
    });
  }

  unlockLobby() {
    this.lobbyService.unlockLobby(this.id).subscribe(r => {
      if (r['success']) {
        this.lobbyDetails.locked = false;
      }
    });
  }

  showHideCompleted() {
    this.showCompleted = !this.showCompleted;
  }

  teamJoin(team: any) {
    // this.dataPasser.reviewMode = false;
    this.challengeService.joinTeam(team.id).subscribe(() => {
      // const username = this.userService.getUsername();
      // this.notesProvider.memberJoin(this.id, team.id, username);
      // team.members.push(username);
    });
  }

  teamLeave(team: any) {}

  openChallengeSettings(id: string) {
    this.router.navigateByUrl('/lobby/team/' + id + '/edit');
  }

  openSettings() {
    // this.settingsModel.nativeElement.style.display = 'initial';
    this.router.navigateByUrl('/lobby/' + this.id + '/settings');
  }
  openModal(team: any, modalToShow: TemplateRef<any>) {
    this.teamForModal = team;
    this.modalService.show(modalToShow);
  }

  closeAllModals() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    document.body.classList.remove('modal-open');
  }

  changeName(event: { team: any; newName: string }) {
    this.challengeService
      .changeTeamName(event.team.id, event.newName)
      .subscribe(r => {
        if (r['success']) {
          event.team.name = event.newName;
        }
      });
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
}
