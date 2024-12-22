import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormControlValidationDirective } from './form-control-validation.directive';

@Component({
  selector: 'pr-form',
  standalone: true,
  template: `
    <form [formGroup]="userForm">
      <div class="mb-3 row">
        <label for="lastName" class="form-label">Name</label>
        <div class="col-sm-10">
          <input class="form-control" id="lastName" placeholder="Name" formControlName="lastName" />
        </div>
      </div>
    </form>
  `,
  imports: [FormControlValidationDirective, ReactiveFormsModule]
})
class FormComponent {
  fb = inject(NonNullableFormBuilder);
  userForm = this.fb.group({
    lastName: ['', Validators.required]
  });
}

describe('FormControlValidationDirective', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should add the is-invalid CSS class', () => {
    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement.query(By.directive(FormControlValidationDirective));
    expect(directive).withContext('The directive should be applied to an element with a class `form-control`').not.toBeNull();

    const lastName = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#lastName')!;
    expect(lastName.classList).not.toContain('is-invalid');

    lastName.value = 'Rainbow';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(lastName.classList).not.toContain('is-invalid');

    lastName.value = '';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(lastName.classList).toContain('is-invalid');

    lastName.value = 'Rainbow';
    lastName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(lastName.classList).not.toContain('is-invalid');
  });
});
