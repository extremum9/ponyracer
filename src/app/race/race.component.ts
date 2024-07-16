import { Component, Input } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'pr-race',
  standalone: true,
  imports: [PonyComponent, DatePipe],
  templateUrl: './race.component.html',
  styleUrl: './race.component.css'
})
export class RaceComponent {
  @Input({ required: true }) raceModel!: RaceModel;
}
