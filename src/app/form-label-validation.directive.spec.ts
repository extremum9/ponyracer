import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormLabelValidationDirective } from './form-label-validation.directive';
import { FormLabelDirective } from './form-label.directive';

@Component({
  selector: 'pr-form',
  standalone: true,
  template: `
    <form [formGroup]="userForm">
      <div class="mb-3" prFormLabelValidation>
        <label prFormLabel for="lastName" class="form-label">Name</label>
        <div>
          <input class="form-control" id="lastName" placeholder="Name" formControlName="lastName" />
        </div>
      </div>
    </form>
  `,
  imports: [FormLabelValidationDirective, FormLabelDirective, ReactiveFormsModule]
})
class FormComponent {
  fb = inject(NonNullableFormBuilder);
  userForm = this.fb.group({
    lastName: ['', Validators.required]
  });
}

describe('FormLabelValidationDirective', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should call the setValidity method from FormLabelDirective on status change', () => {
    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const directiveInstance = fixture.debugElement.query(By.directive(FormLabelDirective)).injector.get(FormLabelDirective);
    spyOn(directiveInstance, 'setValidity').and.callThrough();
    expect(directiveInstance.setValidity).not.toHaveBeenCalled();

    const lastName = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#lastName')!;
    lastName.value = '';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(directiveInstance.setValidity).toHaveBeenCalledTimes(1);
    expect(directiveInstance.setValidity)
      .withContext('The directive should call setValidity with true if the field is invalid')
      .toHaveBeenCalledWith(true);

    lastName.value = 'Raindow';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(directiveInstance.setValidity).toHaveBeenCalledTimes(2);
    expect(directiveInstance.setValidity)
      .withContext('The directive should call setValidity with false if the field is valid')
      .toHaveBeenCalledWith(false);
  });
});
