import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data';


@Component({

  selector: 'app-trip-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-edit.html',
  styleUrl: './trip-edit.css',

})
export class TripEdit {

  @Input() trip!: Trip;

  @Output() saved = new EventEmitter<Trip>();

  constructor (private tripDataService: TripDataService) {}

  saveTrip(): void {

    this.tripDataService.updateTrip(this.trip).subscribe({

      next: (updatedTrip) => {

        console.log('Trip updated:', updatedTrip);

        this.saved.emit(updatedTrip);

      },

      error: (err) => {console.error(err);


      }

    });

  }

}
