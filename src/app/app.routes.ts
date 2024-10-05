import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';
import { loggedInGuard } from './logged-in.guard';
import { PendingRacesComponent } from './races/pending-races/pending-races.component';
import { FinishedRacesComponent } from './races/finished-races/finished-races.component';
import { RacesComponent } from './races/races.component';

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
        component: RacesComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'pending'
          },
          {
            path: 'pending',
            component: PendingRacesComponent
          },
          {
            path: 'finished',
            component: FinishedRacesComponent
          }
        ]
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
