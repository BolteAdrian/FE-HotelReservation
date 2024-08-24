import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/details`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  getUserReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  cancelReservation(reservationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservations/${reservationId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }
}
