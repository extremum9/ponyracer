import { Directive } from '@angular/core';

@Directive({
  selector: 'label[prFormLabel]',
  standalone: true,
  host: {
    '[class.text-danger]': 'isInvalid'
  }
})
export class FormLabelDirective {
  public isInvalid: boolean | null = false;

  constructor() {}

  public setValidity(validity: boolean | null): void {
    this.isInvalid = validity;
  }
}
