import { Route } from '@angular/router';
import { RacesComponent } from './races.component';
import { PendingRacesComponent } from './pending-races/pending-races.component';
import { FinishedRacesComponent } from './finished-races/finished-races.component';
import { BetComponent } from '../bet/bet.component';
import { LiveComponent } from '../live/live.component';

export const racesRoutes: Route[] = [
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
];
