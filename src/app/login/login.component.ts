import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'pr-login',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private _fb = inject(NonNullableFormBuilder);
  public authenticationFailed = false;
  public loginCtrl = this._fb.control('', Validators.required);
  public passwordCtrl = this._fb.control('', Validators.required);
  public userForm = this._fb.group({
    login: this.loginCtrl,
    password: this.passwordCtrl
  });

  constructor(
    private _router: Router,
    private _userService: UserService
  ) {}

  public authenticate(): void {
    this.authenticationFailed = false;
    const { login, password } = this.userForm.value;
    this._userService.authenticate(login!, password!).subscribe({
      next: () => this._router.navigateByUrl('/'),
      error: () => (this.authenticationFailed = true)
    });
  }
}
