import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'pr-birth-year-input',
  standalone: true,
  imports: [],
  templateUrl: './birth-year-input.component.html',
  styleUrl: './birth-year-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BirthYearInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BirthYearInputComponent),
      multi: true
    }
  ]
})
export class BirthYearInputComponent implements ControlValueAccessor, Validator {
  @Input({ required: true }) inputId!: string;
  public value: number | null = null;
  public year: number | null = null;
  public disabled = false;
  public onChange: (value: number | null) => void = () => {};
  public onTouched: () => void = () => {};

  private computeYear(value: number | null): number | null {
    const lastTwoDigitsOfTheCurrentYear = new Date().getFullYear() % 100;
    const firstTwoDigitsOfTheCurrentYear = Math.floor(new Date().getFullYear() / 100);

    if (value === null) {
      return null;
    } else if (value < 0 || value > 100) {
      return value;
    } else if (value > lastTwoDigitsOfTheCurrentYear) {
      return (firstTwoDigitsOfTheCurrentYear - 1) * 100 + value;
    } else {
      return firstTwoDigitsOfTheCurrentYear * 100 + value;
    }
  }

  public writeValue(value: number | null): void {
    this.value = value;
    this.year = this.computeYear(value);
  }

  public registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onBirthYearChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (isNaN(value)) {
      this.year = null;
      this.onChange(null);
    } else {
      this.year = this.computeYear(value);
      this.onChange(this.year);
    }
  }

  public validate(): ValidationErrors | null {
    const currentYear = new Date().getFullYear();
    if (this.year === null) {
      return null;
    } else if (this.year < 1900 || this.year > currentYear) {
      return { invalidYear: true };
    }
    return null;
  }
}
