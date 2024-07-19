import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  public navbarCollapsed = true;

  public toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
