import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbySettingsComponent } from './lobby-settings/lobby-settings.component';
import { LobbyPageComponent } from './lobby-page/lobby-page.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { SolutionsComponent } from './solutions/solutions.component';
import { SolutionPageComponent } from './solution-page/solution-page.component';
import { BrainstormComponent } from './brainstorm/brainstorm.component';

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
  },
  { path: ':id/solutions', component: SolutionsComponent },
  {
    path: ':id/solutions/:userID/:challengeID',
    component: SolutionPageComponent
  },
  {
    path: ':id/solutions/:userID',
    component: SolutionsComponent,
    data: { lobby: true }
  },
  {
    path: ':id/solutions/lobby/:userID',
    component: SolutionPageComponent,
    data: { lobby: true }
  },
  { path: ':id/brainstorm', component: BrainstormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbyRoutingModule {}
