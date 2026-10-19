import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripDataService } from '../services/trip-data';
import { Trip } from '../models/trip';
import { TripCard } from '../trip-card/trip-card';
import { TripEdit } from '../trip-edit/trip-edit';
import { TripAdd } from '../trip-add/trip-add';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [
    CommonModule,
    TripCard,
    TripEdit,
    TripAdd
  ],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css'
})

export class TripList implements OnInit {

  trips: Trip[] = [];
  selectedTrip?: Trip;

  constructor(
    private tripDataService: TripDataService,
    private cdr: ChangeDetectorRef
  ) {}

  editTrip(trip: Trip): void {
    console.log('Selected trip:', trip);

    this.selectedTrip = trip;

    this.cdr.markForCheck();
  }

  tripAdded(newTrip: Trip): void {
    this.trips.push(newTrip);

    this.cdr.markForCheck();
  }

  tripUpdated(updatedTrip: Trip): void {
    const index = this.trips.findIndex (trip => trip._id === updatedTrip._id);

    if (index !== -1) {
      this.trips[index] = updatedTrip;
    }

    this.selectedTrip = undefined;

    this.cdr.markForCheck();
  }

  deleteTrip(trip: Trip): void {

    const confirmed = confirm(`Delete ${trip.name}?`);

    if (!confirmed) {
      return;
    }

    this.tripDataService.deleteTrip(trip).subscribe({

      next: () => {
        console.log('Trip deleted:', trip.name);

        this.trips = this.trips.filter(
          item => item._id !== trip._id
        );

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error('Delete trip error:', err);
      }

    });
  }

  ngOnInit(): void {

    this.tripDataService.getTrips().subscribe({

      next: (value: Trip[]) => {

        console.log('API VALUE:', value);
        console.log('API LENGTH:', value.length);

        this.trips = value;

        this.cdr.markForCheck();

        console.log(
          'TRIPS AFTER ASSIGNMENT:',
          this.trips
        );

        console.log(
          'TRIPS LENGTH AFTER ASSIGNMENT:',
          this.trips.length
        );
      },

      error: (err) => {
        console.error(err);
        alert(JSON.stringify(err));
      }

    });
  }
}