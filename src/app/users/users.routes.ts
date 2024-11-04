import { Route } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { MoneyHistoryComponent } from '../money-history/money-history.component';

export const usersRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'money/history',
    component: MoneyHistoryComponent
  }
];
