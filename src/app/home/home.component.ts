import { Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'pr-home',
  standalone: true,
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public user: Signal<UserModel | null>;

  constructor(private _userService: UserService) {
    this.user = this._userService.currentUser;
  }
}
