import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { FormLabelDirective } from '../form-label.directive';
import { FormLabelValidationDirective } from '../form-label-validation.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'pr-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormLabelDirective,
    FormLabelValidationDirective,
    FormControlValidationDirective,
    NgbAlert,
    TranslocoDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private _fb = inject(NonNullableFormBuilder);
  public loginCtrl = this._fb.control('', Validators.required);
  public passwordCtrl = this._fb.control('', Validators.required);
  public userForm = this._fb.group({
    login: this.loginCtrl,
    password: this.passwordCtrl
  });
  public authenticationFailed = false;

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
