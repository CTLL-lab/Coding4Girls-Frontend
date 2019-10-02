import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { HomeComponent } from './core/home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AuthGuardService } from './authentication/services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'lobbies',
    loadChildren: () => import('./lobbies/lobbies.module').then(m => m.LobbiesModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'lobby',
    loadChildren: () => import('./lobby/lobby.module').then(m => m.LobbyModule),
    canActivate: [AuthGuardService]
  },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {}
