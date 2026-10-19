import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authenticationService: Authentication,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    this.authenticationService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authenticationService.saveToken(response.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
