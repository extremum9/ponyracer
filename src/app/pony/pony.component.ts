import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  standalone: true,
  imports: [],
  templateUrl: './pony.component.html',
  styleUrl: './pony.component.css'
})
export class PonyComponent {
  @Input({ required: true })
  public ponyModel!: PonyModel;
  @Output()
  public readonly ponyClicked = new EventEmitter<PonyModel>();

  public getPonyImageUrl(): string {
    return `images/pony-${this.ponyModel.color.toLowerCase()}.gif`;
  }

  public clicked(): void {
    this.ponyClicked.emit(this.ponyModel);
  }
}
