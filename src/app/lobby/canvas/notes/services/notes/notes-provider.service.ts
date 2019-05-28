import { Injectable } from '@angular/core';
import { PostIt } from '../../../postit';
import { apiURL } from 'src/app/config';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { SocketioService } from 'src/app/shared/services/socketio/socketio.service';

@Injectable()
export class NotesProviderService {
  public socket;
  public notes: Array<PostIt> = new Array();
  public onlineUsers: Array<any> = new Array();
  private highestZ = 0;
  public notesHeight = new BehaviorSubject<number>(0);
  public notesLoaded = new BehaviorSubject<boolean>(false);
  public currentCanvas = new BehaviorSubject<number>(null);
  constructor(
    private userService: UserService,
    private socketService: SocketioService
  ) {
    this.socket = this.socketService.socket;
    this.socket.on('new-note', note => {
      if (note !== undefined) {
        this.notes.push(note);
        this.calculateHighestZ();
      }
    });
    this.socket.on('members-update', r => {
      this.updateOnlineUserList(r);
    });
    this.socket.on('members-update-request', room => {
      this.socket.emit('members-update', {
        username: this.userService.GetUsername(),
        status: 'online',
        room: room
      });
    });
    this.socket.on('move-note', r => {
      if (r.note !== undefined) {
        try {
          this.notes[this.notes.findIndex(x => x.id === r.note.id)] = r.note;
        } catch {}
      }
      this.notesHeight.next(this.calculateNewHeight(this.notes));
    });

    this.socket.on('delete-note', r => {
      if (r.note !== undefined) {
        this.notes.splice(this.notes.findIndex(x => x.id === r.note.id), 1);
        this.calculateHighestZ();
      }
    });
    this.socket.on('edit-note', r => {
      this.notes[this.notes.findIndex(x => x.id === r.note.id)] = r.note;
    });
    this.socket.on('join-room', r => {
      for (const note of r) {
        note.text = note['notetext'];
        note.type = note['contenttype'];
        note.color = note['color'];
        note.locked = note['locked'];
        note.position = { x: note['x'], y: note['y'], z: note['z'] };
        note.size = { width: note['width'], height: note['height'] };
        delete note.x;
        delete note.y;
        delete note.z;
        delete note.width;
        delete note.height;
        delete note.contenttype;
      }
      this.notes = r;
      this.calculateHighestZ();
      this.notesHeight.next(this.calculateNewHeight(this.notes));
      this.notesLoaded.next(true);
    });
    this.socket.on('z-note', r => {
      r.forEach(noteToUpdate => {
        this.notes[
          this.notes.findIndex(note => note.id === noteToUpdate.id)
        ].position.z = noteToUpdate.z;
      });
      this.calculateHighestZ();
    });
    this.socket.on('template-notes', r => {
      this.notes = this.notes.filter(x => x.position.z > 0);
      r.forEach(note => {
        delete note.z;
        note.position = { ...note.position, z: 0 };
        note.locked = true;
        this.notes.push(note);
      });
      this.notesHeight.next(this.calculateNewHeight(this.notes));
    });
  }

  calculateHighestZ() {
    this.highestZ = this._getMaxZ();
  }
  joinCanvas(canvasID) {
    const currentID = this.currentCanvas.getValue();
    if (currentID != null) {
      this.leaveLastCanvas();
    }
    this.socket.emit('room', canvasID, this.userService.user);
    this.currentCanvas.next(canvasID);
  }
  reloadNotes(canvasID) {
    this.leaveLastCanvas();
    this.joinCanvas(canvasID);
  }
  leaveLastCanvas() {
    this.onlineUsers = new Array();
    const canvasID = this.currentCanvas.getValue();
    this.socket.emit('leave-room', canvasID, this.userService.user);
    this.notesLoaded.next(false);
    this.currentCanvas.next(null);
    this.notes = [];
  }
  joinLobbyPage(lobbyID) {
    this.socket.emit('lobby-room', 'lobby-' + lobbyID, this.userService.user);
  }
  leaveLobbyPage() {
    this.socket.emit('leave-lobby-room');
  }
  memberJoin(lobbyID, teamID, username) {
    this.socket.emit(
      'member-joined-a-team',
      'lobby-' + lobbyID,
      username,
      teamID
    );
  }
  memberLeave(lobbyID, teamID, username) {
    this.socket.emit(
      'member-left-a-team',
      'lobby-' + lobbyID,
      username,
      teamID
    );
  }
  challengeChangedInLobby(lobbyID, team) {
    this.socket.emit('challenge-changed-in-lobby', 'lobby-' + lobbyID, team);
  }
  challengeChanged(lobbyID, team) {
    this.socket.emit('challenge-changed', 'lobby-' + lobbyID, team);
  }
  moveNote(postit: PostIt, canvasID) {
    this.socket.emit(
      'move-note',
      {
        note: postit
      },
      canvasID
    );
    this.notesHeight.next(this.calculateNewHeight(this.notes));
  }

  addNewNote(postit: PostIt, canvasID) {
    if (postit.position.z === 1) {
      this.calculateHighestZ();
      this.highestZ += 1;
      postit.position.z = this.highestZ;
    }
    this.notes.push(postit);
    this.socket.emit(
      'new-note',
      postit,
      canvasID,
      this.userService.GetUserID()
    );
  }

  deleteNote(postit: PostIt, canvasID) {
    this.socket.emit(
      'delete-note',
      {
        note: postit
      },
      canvasID,
      this.userService.GetUserID()
    );
    this.notes.splice(this.notes.indexOf(postit), 1);
    this.calculateHighestZ();
  }

  editNote(postit: PostIt, canvasID) {
    this.socket.emit(
      'edit-note',
      {
        note: postit
      },
      canvasID
    );
    this.notesHeight.next(this.calculateNewHeight(this.notes));
  }
  applyTemplate(canvasID) {
    this.socket.emit('template-changed', canvasID);
  }
  moveNoteOnTop(note, canvasID) {
    // if note is template, don't move
    if (note.position.z === 0) {
      return;
    }
    const notesToUpdate = [];
    const zOfMovingNote = note.position.z;
    if (zOfMovingNote >= this.highestZ) {
      return;
    }
    const updatedNotes = this.notes
      .filter(x => x.position.z >= zOfMovingNote && x !== note)
      .map(x => {
        if (x.position.z - 1 > 0) {
          x.position.z -= 1;
        }
        notesToUpdate.push({ id: x.id, z: x.position.z });
        return x;
      });
    this.notes.map(obj => updatedNotes.find(o => o.id === obj.id) || obj);
    if (zOfMovingNote < this.highestZ) {
      note.position.z = this.highestZ;
      notesToUpdate.push({ id: note.id, z: note.position.z });
    }
    if (notesToUpdate.length > 0) {
      this.socket.emit('z-note', notesToUpdate, canvasID);
    }
  }

  updateOnlineUserList(r) {
    if (
      r['status'] === 'online' &&
      this.onlineUsers.indexOf(r['username']) === -1
    ) {
      this.onlineUsers.push(r['username']);
    }
    if (
      r['status'] === 'offline' &&
      this.onlineUsers.indexOf(r['username']) !== -1
    ) {
      this.onlineUsers.splice(this.onlineUsers.indexOf(r['username']), 1);
    }
  }

  _getMaxZ() {
    // find all notes that are not templates
    const nonZeroLength = this.notes.filter(x => x.position.z > 0).length;
    // find the maximum z value, if none set it to 1
    const currentMaxZ = this.notes.reduce(
      (max, val) => (val.position.z > max ? val.position.z : max),
      1
    );
    // if the highest z is different that the length of notes
    if (currentMaxZ !== nonZeroLength) {
      // arrange them (desc)
      this.notes.sort((a, b) => {
        return b.position.z - a.position.z;
      });
      // and map them to new z values where highest is the current length
      // and lowest is 1
      this.notes
        .filter(x => x.position.z > 0)
        .forEach((element, index, b) => {
          element.position.z = nonZeroLength - index;
        });
    }
    // recalculate the max z
    return this.notes.reduce(
      (max, val) => (val.position.z > max ? val.position.z : max),
      1
    );
  }
  calculateNewHeight(notes: Array<PostIt>) {
    if (notes.length < 1) {
      return 500;
    }
    const lowestNote = notes.reduce((a, b) => {
      const sizeA = a.position.y + a.size.height;
      const sizeB = b.position.y + a.size.height;
      if (sizeA > sizeB) {
        return a;
      } else {
        return b;
      }
    });
    return lowestNote.position.y + lowestNote.size.height;
  }
}
