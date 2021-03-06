import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { PostIt } from './postit';

import { ChallengeService } from '../../lobby/services/challenge/challenge.service';
import { Router } from 'node_modules/@angular/router';
import { NoteOptions } from './notes/note/note.component';
import { priviledged_roles } from 'src/app/config';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { NotificationsToasterService } from 'src/app/shared/services/toaster/notifications-toaster.service';
import { NotesProviderService } from './notes/services/notes/notes-provider.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  teamMembers: Array<any>;
  @Input()
  canvasID: string;
  @Input()
  canAddNotes: boolean;
  public messages = new Array();
  public canvasHeight = 800;
  public heightOffset = 200;
  public addNewNoteOptions: NoteOptions = {
    locked: true,
    draggable: false,
    editable: true,
    resizable: false,
    userPriviledged: false,
    lockable: false,
    showExtendedColors: false,
    startInEdit: true
  };
  public newNote: PostIt;
  constructor(
    public notesProvider: NotesProviderService,
    public challengeService: ChallengeService,
    public userService: UserService,
    private notifications: NotificationsToasterService,
    private router: Router,
    private translationService: TranslateService,
    public modalService: BsModalService
  ) {}

  ngOnInit() {
    this.notesProvider.notesHeight.subscribe(x => {
      this.canvasHeight = x + this.heightOffset;
    });
    this.notesProvider.joinCanvas(this.canvasID);
  }

  ngOnDestroy() {
    this.notesProvider.leaveCanvas(this.canvasID);
  }

  async addNewNote(note = null) {
    if (note === null) {
      this.notesProvider.addNewNote(
        new PostIt(
          await this.translationService.get('canvas.18').toPromise(),
          Math.random() * 300,
          Math.random() * 300
        ),
        this.canvasID
      );
    } else {
      note.isUnderEditing = false;
      this.notesProvider.addNewNote(note, this.canvasID);
    }
  }
  resizeStart(event: any) {}
  editText(note: PostIt) {
    note.isUnderEditing = true;
  }

  trackByID(index: number, note: PostIt) {
    return note.id;
  }

  trackByIDAndText(index: number, note: PostIt) {
    return note.id + note.text;
  }

  deleteNote(note) {
    this.notesProvider.deleteNote(note, this.canvasID);
  }

  saveNote(event: { note: PostIt }) {
    this.notesProvider.editNote(event.note, this.canvasID);
  }

  dragNote({ note, event }) {
    const draggedDistance: Number = Math.hypot(
      note.position.x - event.x,
      note.position.y - event.y
    );
    if (draggedDistance > 0) {
      note.position = { ...note.position, ...event };
      this.notesProvider.moveNote(note, this.canvasID);
    }
  }
  resizeNote(note) {
    this.notesProvider.editNote(note, this.canvasID);
  }

  clickNote(note: PostIt) {
    const options = this.getNotesOptions(note);
    if (options.editable) {
      this.notesProvider.moveNoteOnTop(note, this.canvasID);
    }
  }

  getNotesOptions(note: PostIt) {
    const options: NoteOptions = {
      locked: false,
      draggable: false,
      editable: false,
      resizable: false,
      showExtendedColors: false,
      lockable: false,
      userPriviledged: false
    };

    options.userPriviledged = priviledged_roles.includes(
      this.userService.getRole()
    );
    options.locked = note.locked && !options.userPriviledged;
    options.resizable =
      !options.locked && !note.isUnderEditing && this.canAddNotes;
    options.draggable = options.resizable;
    options.editable = !options.locked && this.canAddNotes;
    options.showExtendedColors = options.userPriviledged;
    options.lockable = options.userPriviledged;
    return options;
  }

  async showNewNoteModal(modalToShow: TemplateRef<any>) {
    this.newNote = new PostIt(
      await this.translationService.get('canvas.18').toPromise(),
      0,
      0
    );
    this.modalService.show(modalToShow, {
      backdrop: 'static'
    });
  }

  saveNoteFromModal() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    document.body.classList.remove('modal-open');
    this.addNewNote(this.newNote);
  }

  testFunc() {
    console.log('mouse down');
  }

  closeModal() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    document.body.classList.remove('modal-open');
  }
}
