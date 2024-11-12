import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  standalone: true,
  imports: [],
  templateUrl: './pony.component.html',
  styleUrl: './pony.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PonyComponent {
  @Input({ required: true })
  public ponyModel!: PonyModel;

  @Input()
  public isRunning = false;

  @Input()
  public isBoosted = false;

  @Output()
  public readonly ponyClicked = new EventEmitter<PonyModel>();

  public getPonyImageUrl(): string {
    return `images/pony-${this.ponyModel.color.toLowerCase()}${this.isBoosted ? '-rainbow' : this.isRunning ? '-running' : ''}.gif`;
  }

  public clicked(): void {
    this.ponyClicked.emit(this.ponyModel);
  }
}
