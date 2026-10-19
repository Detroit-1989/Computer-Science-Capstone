import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { Authentication } from './authentication'

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

  constructor (
    private http: HttpClient,
    private authenticationService: Authentication) {}

    private getAuthHeaders(): HttpHeaders {
      const token = this.authenticationService.getToken();

      return new HttpHeaders({Authorization: `Bearer ${token}`});
    }

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]> (
      `http://localhost:3000/api/trips`
    );
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip> (
      'http://localhost:3000/api/trips', trip, {headers: this.getAuthHeaders() }
    );
  }

  updateTrip(trip: Trip): Observable<Trip> {
    return this.http.put<Trip> (
      `http://localhost:3000/api/trips/${trip._id}`, trip, {headers: this.getAuthHeaders()}
    );
  }

  deleteTrip(trip: Trip): Observable<any> {
    return this.http.delete(
      `http://localhost:3000/api/trips/${trip._id}`, {headers: this.getAuthHeaders()}
    );
  }

}
