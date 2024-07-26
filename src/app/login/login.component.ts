import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pr-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  #fb = inject(NonNullableFormBuilder);
  loginCtrl = this.#fb.control('', Validators.required);
  passwordCtrl = this.#fb.control('', Validators.required);
  userForm = this.#fb.group({
    login: this.loginCtrl,
    password: this.passwordCtrl
  });
  authenticationFailed = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  authenticate(): void {
    this.authenticationFailed = false;
    const { login, password } = this.userForm.value;
    this.userService.authenticate(login!, password!).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => (this.authenticationFailed = true)
    });
  }
}
