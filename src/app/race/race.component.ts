import { Component, Input } from '@angular/core';
import { RaceModel } from '../models/race.model';

@Component({
  selector: 'pr-race',
  standalone: true,
  imports: [],
  templateUrl: './race.component.html',
  styleUrl: './race.component.css'
})
export class RaceComponent {
  @Input({ required: true }) raceModel!: RaceModel;
}
