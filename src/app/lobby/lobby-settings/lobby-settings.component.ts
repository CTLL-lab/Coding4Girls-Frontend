import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyService } from 'src/app/shared/services/lobby/lobby.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { priviledged_roles, languages_available } from 'src/app/config';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { fully_priviledged_roles } from '../../config';
import { SnapService } from 'src/app/shared/snap/snap.service';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
@Component({
  selector: 'app-lobby-settings',
  templateUrl: './lobby-settings.component.html',
  styleUrls: ['./lobby-settings.component.css'],
  providers: [LobbyService]
})
export class LobbySettingsComponent implements OnInit {
  public languageImages = {};
  public languages = [];

  public fullyPriviledgedRoles = fully_priviledged_roles;

  public lobbyDetails = null;
  public id: string;
  public role: string;
  private lobbyDetailsOrig = null;
  public isUserPriviledged = false;

  // Snap
  public snapTemplate = null;
  // Quill
  public htmlPage = {};
  public htmlPageAfter = {};
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
    public user: UserService,
    private route: ActivatedRoute,
    private lobbyService: LobbyService,
    private router: Router,
    public notifications: NotificationsToasterService,
    private translationService: TranslateService,
    private modalService: BsModalService,
    private snapService: SnapService,
    private spinner: SpinnerService
  ) {
    for (let lang of languages_available) {
      this.languageImages[lang.code] = lang.imagePath;
      this.languages.push(lang.code);
    }
  }

  ngOnInit() {
    this.role = this.user.getRole();
    this.isUserPriviledged = priviledged_roles.includes(this.role);
    this.id = this.route.snapshot.paramMap.get('id');
    this.lobbyService.getLobbyDetails(this.id).subscribe(r => {
      this.lobbyDetails = r['data']['lobby'];
      this.lobbyDetailsOrig = { ...this.lobbyDetails };
    });

    // Populate quill text editor
    this.lobbyService.GetLobbyInstructionsPage(this.id).subscribe(x => {
      this.htmlPage = x;
      console.log(x);
    });

    this.lobbyService.GetLobbyInstructionsAfterPage(this.id).subscribe(x => {
      this.htmlPageAfter = x;
    });

    // Populate snap
    this.lobbyService.GetLobbySnapTemplate(this.id).subscribe((y: string) => {
      this.snapService.LoadProject(y);
    });
  }
  goBack() {
    this.router.navigateByUrl('/lobby/' + this.id);
  }
  saveChanges() {
    const snapTemplateXML = this.snapService.GetCurrentSnapData();
    this.spinner.show();
    forkJoin([
      this.lobbyService.saveLobbySettings(this.lobbyDetails),
      this.lobbyService.EditLobbySnapTemplate(this.id, snapTemplateXML),
      this.lobbyService.EditLobbyInstructionsPages(
        this.id,
        this.htmlPage,
        this.htmlPageAfter
      )
    ]).subscribe(
      r => {
        this.spinner.hide();
        this.translationService.get('in-code.9').subscribe(k => {
          this.notifications.showSuccess(k);
        });
        this.goBack();
      },
      err => {
        this.spinner.hide();
        this.translationService.get('in-code.3').subscribe(k => {
          this.notifications.showError(k);
        });
      }
    );
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

  verificationForMakingLobbyPublic(): boolean {
    return false;
  }

  saveClicked(modalToShow) {
    if (this.lobbyDetails.public && !this.lobbyDetailsOrig.public) {
      console.log('making a lobby public');
      this.modalService.show(modalToShow);
    } else {
      this.saveChanges();
    }
  }
}
