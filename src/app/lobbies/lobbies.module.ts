import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbiesRoutingModule } from './lobbies-routing.module';

import { LobbiesComponent } from './lobbies-page/lobbies.component';
import { SharedModule } from '../shared/shared.module';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LobbiesComponent, CreateLobbyComponent],
  imports: [CommonModule, FormsModule, LobbiesRoutingModule, SharedModule],
  exports: [],
  providers: []
})
export class LobbiesModule {}
