import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbiesComponent } from './lobbies-page/lobbies.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';

const routes: Routes = [
  {
    path: '',
    component: LobbiesComponent
  },
  {
    path: 'new',
    component: CreateLobbyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbiesRoutingModule {}
