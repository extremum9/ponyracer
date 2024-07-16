import { PonyModel } from './pony.model';

export interface RaceModel {
  id: number;
  name: string;
  ponies: PonyModel[];
  startInstant: string;
}
