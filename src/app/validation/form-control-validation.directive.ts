/* eslint-disable @angular-eslint/directive-selector */
import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '.form-control',
  standalone: true,
  host: {
    '[class.is-invalid]': 'isInvalid'
  }
})
export class FormControlValidationDirective {
  public get isInvalid(): boolean | null {
    return this._ngControl.dirty && this._ngControl.invalid;
  }

  constructor(private readonly _ngControl: NgControl) {}
}
