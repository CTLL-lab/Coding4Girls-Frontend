import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyPageComponent } from './lobby-page/lobby-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { LobbySettingsComponent } from './lobby-settings/lobby-settings.component';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ChallengeBoxComponent } from './challenge-box/challenge-box.component';
import { SharedModule } from '../shared/shared.module';
import { LobbyRoutingModule } from './lobby-routing.module';
import { ChallengeService } from './services/challenge/challenge.service';
import { SortablejsModule } from 'node_modules/angular-sortablejs';
import { QuillModule } from 'ngx-quill';
import { CanvasComponent } from './canvas/canvas.component';
import { NoteComponent } from './canvas/notes/note/note.component';
import { NotesModule } from './canvas/notes/notes.module';
import { CanvasService } from './services/canvas/canvas.service';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LobbyRoutingModule,
    FormsModule,
    SharedModule,
    SortablejsModule.forRoot({}),
    QuillModule.forRoot(),
    NotesModule
  ],
  declarations: [
    LobbyPageComponent,
    CreateChallengeComponent,
    LobbySettingsComponent,
    ChallengeBoxComponent,
    CanvasComponent
  ],
  providers: [ChallengeService, CanvasService]
})
export class LobbyModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
