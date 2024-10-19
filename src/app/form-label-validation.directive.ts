import { AfterViewInit, ContentChild, Directive } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormLabelDirective } from './form-label.directive';
import { startWith } from 'rxjs';

@Directive({
  selector: '[prFormLabelValidation]',
  standalone: true
})
export class FormLabelValidationDirective implements AfterViewInit {
  @ContentChild(NgControl)
  private readonly _ngControl!: NgControl;

  @ContentChild(FormLabelDirective)
  private readonly _label!: FormLabelDirective;

  public ngAfterViewInit(): void {
    if (this._ngControl && this._label) {
      this._ngControl
        .statusChanges!.pipe(startWith(void 0))!
        .subscribe(() => this._label.setValidity(this._ngControl.dirty && this._ngControl.invalid));
    }
  }
}
