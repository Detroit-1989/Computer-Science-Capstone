import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})


export class TripCard {
  
  @Input() trip!: Trip;

  @Output() edit = new EventEmitter<Trip>();

  @Output() delete = new EventEmitter<Trip>();

  onEdit(): void {this.edit.emit(this.trip);}

  onDelete(): void {this.delete.emit(this.trip);}
  

}