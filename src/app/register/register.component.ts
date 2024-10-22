import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { BirthYearInputComponent } from '../birth-year-input/birth-year-input.component';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { FormLabelDirective } from '../form-label.directive';
import { FormLabelValidationDirective } from '../form-label-validation.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormLabelDirective,
    FormLabelValidationDirective,
    FormControlValidationDirective,
    BirthYearInputComponent,
    NgbAlert
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private _fb = inject(NonNullableFormBuilder);
  public registrationFailed = false;
  public loginCtrl = this._fb.control('', [Validators.required, Validators.minLength(3)]);
  public passwordCtrl = this._fb.control('', Validators.required);
  public confirmPasswordCtrl = this._fb.control('', Validators.required);
  public birthYearCtrl = this._fb.control<number | null>(null, [Validators.required]);

  public passwordGroup = this._fb.group(
    {
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    },
    { validators: RegisterComponent.passwordMatch }
  );

  public userForm = this._fb.group({
    login: this.loginCtrl,
    passwordForm: this.passwordGroup,
    birthYear: this.birthYearCtrl
  });

  constructor(
    private _router: Router,
    private _userService: UserService
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
    this._userService.register(login!, password!, birthYear!).subscribe({
      next: () => this._router.navigateByUrl('/'),
      error: () => (this.registrationFailed = true)
    });
  }
}
