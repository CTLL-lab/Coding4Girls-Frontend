import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbiesRoutingModule } from './lobbies-routing.module';

import { LobbiesComponent } from './lobbies-page/lobbies.component';
import { SharedModule } from '../shared/shared.module';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [LobbiesComponent, CreateLobbyComponent],
  imports: [
    CommonModule,
    FormsModule,
    LobbiesRoutingModule,
    SharedModule,
    QuillModule
  ],
  exports: [],
  providers: []
})
export class LobbiesModule {}
