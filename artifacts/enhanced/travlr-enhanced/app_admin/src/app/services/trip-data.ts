import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { Authentication } from './authentication'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor (
    private http: HttpClient,
    private authenticationService: Authentication) {}

    private getAuthHeaders(): HttpHeaders {
      const token = this.authenticationService.getToken();

      return new HttpHeaders({Authorization: `Bearer ${token}`});
    }

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]> (
      `${this.apiBaseUrl}/trips`
    );
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip> (
      '${this.apiBaseUrl}/trips', trip, {headers: this.getAuthHeaders() }
    );
  }

  updateTrip(trip: Trip): Observable<Trip> {
    return this.http.put<Trip> (
      `${this.apiBaseUrl}/trips/${trip._id}`, trip, {headers: this.getAuthHeaders()}
    );
  }

  deleteTrip(trip: Trip): Observable<any> {
    return this.http.delete(
      `${this.apiBaseUrl}/trips/${trip._id}`, {headers: this.getAuthHeaders()}
    );
  }

}
