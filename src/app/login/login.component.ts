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
  private fb = inject(NonNullableFormBuilder);
  public loginCtrl = this.fb.control('', Validators.required);
  public passwordCtrl = this.fb.control('', Validators.required);
  public userForm = this.fb.group({
    login: this.loginCtrl,
    password: this.passwordCtrl
  });
  public authenticationFailed = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  public authenticate(): void {
    this.authenticationFailed = false;
    const { login, password } = this.userForm.value;
    this.userService.authenticate(login!, password!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.authenticationFailed = true)
    });
  }
}
