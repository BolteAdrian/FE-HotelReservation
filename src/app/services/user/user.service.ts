import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * The UserService handles all operations related to user details and reservations.
 * It provides methods to interact with the backend API for user-related data.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/user'; // Base URL for the user-related API endpoints

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Retrieves the details of the authenticated user.
   *
   * @returns An Observable that emits the user's details.
   */
  getUserDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/details`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`, // Attaches the JWT for authentication
      }),
    });
  }

  /**
   * Retrieves the list of reservations for the authenticated user.
   *
   * @returns An Observable that emits the user's reservations.
   */
  getUserReservations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`, // Attaches the JWT for authentication
      }),
    });
  }
  
  /**
   * Cancels a specific reservation for the authenticated user.
   *
   * @param reservationId The ID of the reservation to be canceled.
   * @returns An Observable that emits the server's response to the cancellation request.
   */
  cancelReservation(reservationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservations/${reservationId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`, // Attaches the JWT for authentication
      }),
      responseType: 'text',
    });
  }
}
