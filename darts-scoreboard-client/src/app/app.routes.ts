import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { PlayerList } from './players/player-list/player-list';
import { GameCreate } from './games/game-create/game-create';
import { GameDetails } from './games/game-details/game-details';
import { Register } from './auth/register/register';
import { GameList }
  from './games/game-list/game-list';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'players',
    component: PlayerList
  },
  {
    path: 'games',
    redirectTo: 'games/active',
    pathMatch: 'full'
  },
  {
    path: 'games/create',
    component: GameCreate
  },
  {
    path: 'games/active',
    component: GameList
  },
  {
    path: 'games/history',
    component: GameList
  },
  {
    path: 'games/:id',
    component: GameDetails
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'reset-password',
    component: ResetPassword
  }
];
