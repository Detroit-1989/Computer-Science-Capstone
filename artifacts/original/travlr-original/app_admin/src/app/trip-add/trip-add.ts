import {
  Component,
  Output,
  EventEmitter
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-trip-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trip-add.html',
  styleUrl: './trip-add.css'
})
export class TripAdd {

  @Output() added = new EventEmitter<Trip>();

  trip: Trip = {
    _id: '',
    code: '',
    name: '',
    length: '',
    start: '',
    resort: '',
    perPerson: '',
    image: '',
    description: ''
  };

  constructor(
    private tripDataService: TripDataService
  ) {}

  addTrip(): void {

    this.tripDataService
      .addTrip(this.trip)
      .subscribe({

        next: (newTrip) => {
          console.log('Trip added:', newTrip);

          this.added.emit(newTrip);

          this.resetForm();
        },

        error: (err) => {
          console.error('Add trip error:', err);
        }

      });
  }

  resetForm(): void {

    this.trip = {
      _id: '',
      code: '',
      name: '',
      length: '',
      start: '',
      resort: '',
      perPerson: '',
      image: '',
      description: ''
    };
  }
}
