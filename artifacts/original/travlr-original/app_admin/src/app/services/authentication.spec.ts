import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiBaseUrl}/login`,
      { email, password }
    );
  }

  public saveToken(token: string): void {
    localStorage.setItem('travlr-token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('travlr-token');
  }

  public logout(): void {
    localStorage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
