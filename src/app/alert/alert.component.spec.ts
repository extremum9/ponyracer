import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

@Component({
  standalone: true,
  imports: [AlertComponent],
  template: `<pr-alert [type]="type()" [dismissible]="dismissible()" (closed)="closed.set(true); event.set($event)">Hello</pr-alert>`
})
class AlertTestComponent {
  type = signal<'success' | 'danger' | 'warning'>('warning');
  dismissible = signal(true);
  closed = signal(false);
  event = signal<Event | null>(null);
}

describe('AlertComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display a div with correct classes', () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const rootDiv = element.querySelector('div')!;
    expect(rootDiv).withContext('The AlertComponent should display a `div`').not.toBeNull();
    expect(rootDiv.className).withContext('The div should have the `alert` class').toContain('alert');
    expect(rootDiv.className)
      .withContext('The div should have the `alert-warning` class if no type is specified')
      .toContain('alert-warning');
    expect(rootDiv.className).withContext('The div should have the `alert-dismissible` class').toContain('alert-dismissible');

    fixture.componentInstance.dismissible.set(false);
    fixture.detectChanges();
    expect(rootDiv.className)
      .withContext('The div should not have the `alert-dismissible` class if dismissible is false')
      .not.toContain('alert-dismissible');

    fixture.componentInstance.dismissible.set(true);
    fixture.componentInstance.type.set('danger');
    fixture.detectChanges();
    expect(rootDiv.className).withContext('The div should have the `alert-danger` class if type is danger').toContain('alert-danger');
    expect(rootDiv.className)
      .withContext('The div should not have the `alert-warning` class if type is danger')
      .not.toContain('alert-warning');
    expect(rootDiv.className).withContext('The div should have the `alert-dismissible` class').toContain('alert-dismissible');

    fixture.componentInstance.type.set('success');
    fixture.detectChanges();
    expect(rootDiv.className).withContext('The div should have the `alert-success` class if type is success').toContain('alert-success');
    expect(rootDiv.className)
      .withContext('The div should not have the `alert-danger` class if type is success')
      .not.toContain('alert-danger');
    expect(rootDiv.className).withContext('The div should have the `alert-dismissible` class').toContain('alert-dismissible');
  });

  it('should display the content', () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).withContext('The AlertComponent should use `ng-content`').toContain('Hello');
  });

  it('should display a button depending on dismissible input', () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    fixture.componentInstance.dismissible.set(false);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('button')).withContext('The AlertComponent should not display a `button` if not dismissible').toBeNull();

    fixture.componentInstance.dismissible.set(true);
    fixture.detectChanges();
    expect(element.querySelector('button')).withContext('The AlertComponent should display a `button` if dismissible').not.toBeNull();
  });

  it('should emit a close event', () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector('button')!.click();
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.closed()).withContext('You should emit an event on close').toBe(true);
    expect(component.event()).withContext('The close event should emit a void event').toBeUndefined();
  });
});
