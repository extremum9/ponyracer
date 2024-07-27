import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pr-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  public registrationFailed = false;
  public loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  public passwordCtrl = this.fb.control('', Validators.required);
  public confirmPasswordCtrl = this.fb.control('', Validators.required);
  public birthYearCtrl = this.fb.control<number | null>(null, [
    Validators.required,
    Validators.min(1900),
    Validators.max(new Date().getFullYear())
  ]);
  public passwordGroup = this.fb.group(
    {
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    },
    { validators: RegisterComponent.passwordMatch }
  );
  public userForm = this.fb.group({
    login: this.loginCtrl,
    passwordForm: this.passwordGroup,
    birthYear: this.birthYearCtrl
  });

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  static passwordMatch(control: AbstractControl<{ password: string; confirmPassword: string }>): ValidationErrors | null {
    const password = control.value.password;
    const confirmPassword = control.value.confirmPassword;
    return password !== confirmPassword ? { matchingError: true } : null;
  }

  public register(): void {
    this.registrationFailed = false;
    const { login, birthYear } = this.userForm.value;
    const password = this.passwordGroup.value.password;
    this.userService.register(login!, password!, birthYear!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.registrationFailed = true)
    });
  }
}
