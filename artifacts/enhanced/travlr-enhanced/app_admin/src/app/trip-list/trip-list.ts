import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripDataService } from '../services/trip-data';
import { Trip } from '../models/trip';
import { TripCard } from '../trip-card/trip-card';
import { TripEdit } from '../trip-edit/trip-edit';
import { TripAdd } from '../trip-add/trip-add';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TripCard,
    TripEdit,
    TripAdd
  ],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css'
})

export class TripList implements OnInit {

  trips: Trip[] = [];

  filteredTrips: Trip[] = []
  selectedResort: string = '';
  selectedLength: string = '';
  maxPrice: number | null = null;
  sortOrder: string = '';

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
        this.filteredTrips = [...value];

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

  get resorts(): string[] {

    return [

      ...new Set(

        this.trips
          .map(trip => trip.resort)
          .filter(resort => resort)

      )
    ].sort();
  }

  get tripLengths(): string[] {

    return [

      ...new Set(

        this.trips.map(trip => String(trip.length)).filter(length => length))
    ].sort((a, b) => Number(a) - Number(b));
  }

  applyFilters(): void {

    this.filteredTrips = this.trips.filter(trip => {

      const matchesResort = this.selectedResort === '' ||
        trip.resort === this.selectedResort;

      const matchesLength = this.selectedLength === '' ||
        String(trip.length) === this.selectedLength;

      const matchesPrice =
        this.maxPrice === null ||
        this.maxPrice <= 0 ||
        Number(trip.perPerson) <= this.maxPrice;

      return (

        matchesResort &&
        matchesLength &&
        matchesPrice

      );
    });

    this.applySorting();
  }

  applySorting(): void {

    if (this.sortOrder === 'priceLowHigh') {

      this.filteredTrips.sort(

        (a, b) => Number(a.perPerson) - Number(b.perPerson)

      );
    }

    if (this.sortOrder === 'priceHighLow') {

      this.filteredTrips.sort(

        (a, b) => Number(b.perPerson) - Number(a.perPerson)

      );
    }

    if (this.sortOrder === 'nameAZ') {

      this.filteredTrips.sort(

        (a, b) => a.name.localeCompare(b.name)
      );
    }

  }

  resetFilters(): void {

    this.selectedResort = '';
    this.selectedLength = '';
    this.maxPrice = null;
    this.sortOrder = '';

    this.filteredTrips = [...this.trips];
  }
}
