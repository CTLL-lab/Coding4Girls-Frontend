import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbySettingsComponent } from './lobby-settings/lobby-settings.component';
import { LobbyPageComponent } from './lobby-page/lobby-page.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';

const routes: Routes = [
  {
    path: ':id',
    component: LobbyPageComponent
  },
  {
    path: ':id/settings',
    component: LobbySettingsComponent
  },
  {
    path: 'team/:id/edit',
    component: CreateChallengeComponent
  },
  {
    path: ':id/team/new',
    component: CreateChallengeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbyRoutingModule {}
