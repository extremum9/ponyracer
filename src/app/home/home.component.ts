import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'pr-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public user: UserModel | null = null;

  constructor(private _userService: UserService) {
    this._userService.userEvents.pipe(takeUntilDestroyed()).subscribe(user => (this.user = user));
  }
}
