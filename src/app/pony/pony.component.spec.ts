import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PonyModel } from '../models/pony.model';
import { PonyComponent } from './pony.component';

@Component({
  standalone: true,
  imports: [PonyComponent],
  template: '<pr-pony [ponyModel]="pony()" (ponyClicked)="isPonyClicked.set(true)" />'
})
export class PonyTestComponent {
  pony = signal<PonyModel>({ id: 1, name: 'Fast Rainbow', color: 'PURPLE' });
  isPonyClicked = signal(false);
}

describe('PonyComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display an image and a legend', () => {
    const fixture = TestBed.createComponent(PonyTestComponent);
    fixture.detectChanges();

    // then we should have an image and a legend
    const element = fixture.nativeElement as HTMLElement;
    const image = element.querySelector('img')!;
    expect(image).withContext('You should have an image for the pony').not.toBeNull();
    expect(image.getAttribute('src')).withContext('The `src` attribute of the image is not correct').toBe('images/pony-purple.gif');
    expect(image.getAttribute('alt')).withContext('The `alt` attribute for the image is not correct').toBe('Fast Rainbow');
    const legend = element.querySelector('figcaption')!;
    expect(legend).withContext('You should have a `figcaption` element for the pony').not.toBeNull();
    expect(legend.textContent).withContext('The `figcaption` element should display the name of the pony').toContain('Fast Rainbow');
  });

  it('should emit an event on click', () => {
    const fixture = TestBed.createComponent(PonyTestComponent);
    fixture.detectChanges();

    // when we click on the element
    const element = fixture.nativeElement as HTMLElement;
    const figure = element.querySelector('figure')!;
    expect(figure).withContext('You should have a `figure` element for the pony').not.toBeNull();
    expect(window.getComputedStyle(figure).getPropertyValue('padding-top'))
      .withContext('You must apply some styles to the `figure` element')
      .toBe('3px');
    figure.click();

    expect(fixture.componentInstance.isPonyClicked())
      .withContext('You may have forgot the click handler on the `figure` element')
      .toBeTruthy();
  });
});
