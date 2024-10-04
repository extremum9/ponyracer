import { Routes } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';
import { loggedInGuard } from './logged-in.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'races',
    canActivate: [loggedInGuard],
    children: [
      {
        path: '',
        component: RacesComponent
      },
      {
        path: ':raceId',
        component: BetComponent
      },
      {
        path: ':raceId/live',
        component: LiveComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
