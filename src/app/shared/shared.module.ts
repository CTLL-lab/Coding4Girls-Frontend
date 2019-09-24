// import ngx-translate and the http loader
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerComponent } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationsToasterService } from './services/toaster/notifications-toaster.service';
import { SpinnerService } from './services/spinner/spinner.service';
import { UserService } from '../authentication/services/user/user.service';
import { ModalModule, BsModalService } from 'node_modules/ngx-bootstrap';
import { LobbyService } from './services/lobby/lobby.service';
import { SocketioService } from './services/socketio/socketio.service';
import { QuillModule } from 'ngx-quill';
import { CanvasComponent } from './canvas/canvas.component';
import { NoteComponent } from './canvas/notes/note/note.component';
import { NotesModule } from './canvas/notes/notes.module';
import { ChallengeService } from '../lobby/services/challenge/challenge.service';
import { NotesProviderService } from './canvas/notes/services/notes/notes-provider.service';
import { UploaderService } from './services/uploader/uploader.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    ModalModule.forRoot(),
    QuillModule.forRoot(),
    NotesModule
  ],
  declarations: [CanvasComponent],
  providers: [ToastrService, ChallengeService],
  exports: [
    TranslateModule,
    TranslatePipe,
    NgxSpinnerComponent,
    CanvasComponent,
    NoteComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        NotificationsToasterService,
        SpinnerService,
        UserService,
        BsModalService,
        LobbyService,
        SocketioService,
        UploaderService,
        NotesProviderService
      ]
    };
  }
}
