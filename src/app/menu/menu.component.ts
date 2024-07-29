import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  public navbarCollapsed = true;
  public user: UserModel | null = null;

  constructor(private _userService: UserService) {
    this._userService.userEvents.pipe(takeUntilDestroyed()).subscribe(user => (this.user = user));
  }

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
