import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { LobbyService } from '../../shared/services/lobby/lobby.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/authentication/services/user/user';
import { priviledged_roles } from 'src/app/config';
import { BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.css'],
  providers: [LobbyService]
})
export class LobbiesComponent implements OnInit, OnDestroy {
  public publicLobbiesView = false;
  public lobbiesJoined: Array<any> = new Array();
  public showSuccessAlert = false;
  public role: string = null;
  public user: User;
  public userPriviledged = false;
  public LobbyCloneForm: FormGroup;
  public page = 1;
  public pages = 1;
  public searchInput: String;

  private lobbiesObs: Subscription;
  private userObs: Subscription;
  private paramsObs: Subscription;
  private fetcherObs: Observable<Object>;
  private lobbiesPerPage = 25;

  constructor(
    private userService: UserService,
    private lobbyService: LobbyService,
    private notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.public) {
      this.publicLobbiesView = this.activatedRoute.snapshot.data.public;
    }
    if (this.publicLobbiesView) {
      this.paramsObs = this.activatedRoute.queryParams.subscribe(x => {
        if (x['page']) {
          this.page = x['page'];
        }
        if (x['search']) {
          this.fetcherObs = this.lobbyService.SearchPublicLobby(
            x['search'],
            this.page
          );
        } else {
          this.fetcherObs = this.lobbyService.GetPublicLobbies(this.page);
        }
        this.grabLobbies(this.fetcherObs);
      });
    } else {
      this.fetcherObs = this.lobbyService.getUserLobbies();
    }
    this.userObs = this.userService.user.subscribe(x => {
      this.user = x;
      this.grabLobbies(this.fetcherObs);
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

  ngOnDestroy() {
    if (this.lobbiesObs) {
      this.lobbiesObs.unsubscribe();
    }
    if (this.userObs) {
      this.userObs.unsubscribe();
    }
    if (this.paramsObs) {
      this.paramsObs.unsubscribe();
    }
  }

  grabLobbies(fetcherObs: Observable<Object>) {
    if (this.lobbiesObs) {
      this.lobbiesObs.unsubscribe();
    }
    this.lobbiesObs = fetcherObs.subscribe(r => {
      this.lobbiesJoined = r['data']['lobbies'];
      if (this.publicLobbiesView) {
        this.pages = Math.ceil(
          Number(r['data']['totalCount']) / this.lobbiesPerPage
        );
      }
    });
  }
  joinLobby(code: string) {
    this.userService.JoinLobbyByCode(code).subscribe(
      r => {
        this.translationService.get('in-code.6').subscribe(k => {
          this.notifications.showSuccess(k);
        });
        this.grabLobbies(this.fetcherObs);
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
          case 428:
            this.notifications.showError('');
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
          this.grabLobbies(this.fetcherObs);
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
          this.grabLobbies(this.fetcherObs);
        },
        err => {
          if (err.status == 201) {
            this.notifications.showSuccess('');
            this.closeAllModals();
            this.grabLobbies(this.fetcherObs);
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

  ArrayGen(i: number) {
    return new Array(i);
  }

  UserWantsToSearch() {
    if (this.searchInput == '') {
      this.router.navigate(['/lobbies/public'], {
        queryParams: { page: 1 }
      });
    }
    this.router.navigate(['/lobbies/public'], {
      queryParams: { search: this.searchInput, page: 1 }
    });
  }
}
