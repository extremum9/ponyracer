import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  public navbarCollapsed = true;
  public user: Signal<UserModel | null>;

  constructor(
    private _router: Router,
    private _userService: UserService
  ) {
    this.user = this._userService.currentUser;
  }

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  public logout(): void {
    this._userService.logout();
    this._router.navigateByUrl('/');
  }
}
