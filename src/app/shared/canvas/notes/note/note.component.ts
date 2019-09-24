import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EmbedVideoService } from '../services/embed/embed-video.service';
import { PostIt } from '../../postit';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { UploaderService } from 'src/app/shared/services/uploader/uploader.service';

const DIMENSIONS_EDIT = { height: 346, width: 456 };
const DIMENSIONS_NO_EDIT = { height: 130, width: 130 };

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @Input()
  set options(value: NoteOptions) {
    this._options = value;
  }
  get options(): NoteOptions {
    return this._options;
  }
  @Input()
  set note(value: PostIt) {
    this._note = value;
    this.changing = true;
    setTimeout(_ => {
      this.changing = false;
    }, 550);
    this.contentCheck();
  }
  get note(): PostIt {
    return this._note;
  }
  @Input()
  canvasID: any;
  @Output()
  noteDelete = new EventEmitter();
  @Output()
  noteSave = new EventEmitter();
  @Output()
  noteDrag = new EventEmitter();
  @Output()
  noteResize = new EventEmitter();
  @Output()
  noteDragStart = new EventEmitter();

  private _note: PostIt;
  private _options: NoteOptions;
  public note_dimensions = DIMENSIONS_NO_EDIT;
  public deleteTimer = 0;
  public basicColors = [
    '#ffff99',
    '#bfb1d5',
    '#adddcf',
    '#abe1fd',
    '#fed1be',
    '#f0e0a2'
  ];
  public extendedColors = ['white', 'black', 'lightgrey', 'darkgrey'];
  @Input()
  bounds: any;
  inBounds = true;
  myBounds = { top: false, right: false, left: false, bottom: true };
  public youtubeEmbedURL: SafeResourceUrl;
  public youtubeURL = '';
  public changing = false;
  public contentToShow: string;
  private previousContentType = 'text';
  public editorType: string;
  private tempSize: { width: number; height: number } = {
    width: null,
    height: null
  };

  constructor(
    private uploader: UploaderService,
    public userService: UserService,
    public embed: EmbedVideoService
  ) {}

  ngOnInit() {
    this.editorType = this.note.type || 'text';
    if (this.options.startInEdit) {
      this.edit({ tapCount: 2 });
    }
  }

  fileChange(event: any) {
    const file: File = event.target.files[0];
    this.uploader.uploadImage(file).subscribe(r => {
      this.note.content = r['data']['link'];
      this.note.type = 'image';
      this.note.contentposter = this.userService.GetUserID();
      this.noteSave.emit({
        note: this.note
      });
    });
  }
  edit(event?) {
    if (this.note.isUnderEditing) {
      return;
    }
    if (!this.options.editable) {
      return;
    }
    if (!(event && event.tapCount === 2)) {
      return;
    }
    this.note.isUnderEditing = true;
    this.previousContentType = this.note.type;
    if (this.note.size.width < DIMENSIONS_EDIT.width) {
      this.tempSize.width = this.note.size.width;
      this.note.size.width = DIMENSIONS_EDIT.width;
    }
    if (this.note.size.height < DIMENSIONS_EDIT.height) {
      this.tempSize.height = this.note.size.height;
      this.note.size.height = DIMENSIONS_EDIT.height;
    }
    this.note_dimensions = DIMENSIONS_EDIT;
    this.options.draggable = false;
  }
  save() {
    this.note.isUnderEditing = false;
    if (this.tempSize.height != null) {
      this.note.size.height = this.tempSize.height;
      this.tempSize.height = null;
    }
    if (this.tempSize.width != null) {
      this.note.size.width = this.tempSize.width;
      this.tempSize.width = null;
    }
    this.note_dimensions = DIMENSIONS_NO_EDIT;
    this.changeContent();
    this.noteSave.emit({
      note: this.note
    });
    this.options.draggable = true;
  }
  draggingStarted() {
    this.noteDragStart.emit(this.note);
  }
  delete(event) {
    this.deleteTimer = event;
    if (event > 1500) {
      this.noteDelete.emit(this.note);
    }
  }
  toggleLock() {
    if (!this.options.lockable) {
      return;
    }
    this.note.locked = !this.note.locked;
    this.noteSave.emit({ note: this.note });
  }

  draggingStopped(note: PostIt, event: { x: number; y: number }) {
    this.noteDrag.emit({ note, event });
  }

  resized(event) {
    this.note.size = event.size;
    this.noteResize.emit(this.note);
  }
  contentCheck() {
    if (this.note.type === 'video') {
      try {
        this.contentToShow = this.embed.embed(this.note.content);
      } catch {
        this.note.type = 'text';
      }
    } else if (this.note.type === 'text') {
      this.note.content = '';
      this.note.contentposter = null;
    }
    this.editorType = this.note.type;
  }
  changeContent() {
    this.note.type = this.editorType;
    this.contentCheck();
    if (
      this.previousContentType !== this.note.type &&
      this.note.type !== 'text'
    ) {
      this.note.contentposter = this.userService.GetUserID();
    }
  }
}

export interface NoteOptions {
  locked: boolean;
  resizable: boolean;
  draggable: boolean;
  editable: boolean;
  showExtendedColors: boolean;
  lockable: boolean;
  userPriviledged: boolean;
  startInEdit?: boolean;
}
