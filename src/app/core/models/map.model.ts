import { Base } from './base.model';
import { Pin } from './map-tracker.model';

export class DndMap extends Base {
  name = '';
  description = '';
  imageUrl = '';
  resolX = 0;
  resolY = 0;
  imageRef = '';
  pins: Pin[] = [];
}
