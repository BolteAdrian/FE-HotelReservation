import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHotelWithRatings } from 'src/app/models/IHotel';
import { IHotelDetails } from 'src/app/models/IHotelDetails';
import { IRoom } from 'src/app/models/IRoom';

/**
 * The HotelService handles all operations related to hotels, rooms, and reservations.
 * It provides methods to interact with the backend API for hotel-related data.
 */
@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private baseUrl = 'http://localhost:8080'; // Base URL for the hotel-related API endpoints

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a list of hotels within a specified radius from the user's location.
   *
   * @param lat The latitude of the user's location.
   * @param lon The longitude of the user's location.
   * @param radius The radius within which to search for hotels.
   * @returns An Observable that emits an array of Hotel objects.
   */
  getHotelsWithinRadius(
    lat: number,
    lon: number,
    radius: number
  ): Observable<IHotelWithRatings[]> {
    return this.http.get<IHotelWithRatings[]>(
      `${this.baseUrl}/hotels/withinRadius?userLat=${lat}&userLon=${lon}&radius=${radius}`
    );
  }

  /**
   * Retrieves a list of rooms for a specific hotel.
   *
   * @param id The ID of the hotel.
   * @returns An Observable that emits an array of Room objects.
   */
  getRoomsByHotelId(id: number): Observable<IRoom[]> {
    return this.http.get<IRoom[]>(`${this.baseUrl}/hotels/${id}/rooms`);
  }

  /**
   * Retrieves a list of rooms and feedback for a specific hotel.
   *
   * @param id The ID of the hotel.
   * @param userId The ID of the user making the request.
   * @param checkInDate The date for check in.
   * @param checkOutDate The date for check out.
   * @returns An Observable that emits an object containing rooms and feedback.
   */
  getDetailsByHotelId(
    hotelId: number,
    userId: number,
    checkInDate?: string,
    checkOutDate?: string
  ): Observable<IHotelDetails> {
    let url = `${this.baseUrl}/hotels/${hotelId}/details?userId=${userId}`;
    if (checkInDate && checkOutDate) {
      url += `&startDate=${checkInDate}&endDate=${checkOutDate}`;
    }
    return this.http.get<IHotelDetails>(url);
  }

  /**
   * Submits feedback for a specific hotel by sending the feedback details to the backend.
   *
   * @param hotelId The ID of the hotel being reviewed.
   * @param userId The ID of the user leaving the feedback.
   * @param comment The comment or feedback provided by the user.
   * @param rating The rating provided by the user (e.g., out of 5).
   * @returns An Observable that emits the server's response.
   */
  leaveFeedback(
    hotelId: number,
    userId: number,
    comment: string,
    rating: number
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/${hotelId}/feedback`, {
      userId,
      comment,
      rating,
    });
  }

  /**
   * Changes a reservation by sending the new room ID and reservation ID to the backend.
   *
   * @param userId The ID of the User.
   * @param hotelId The ID of the HOTEL.
   * @param newRoomId The ID of the new room to change the reservation to.
   * @returns An Observable that emits the server's response.
   */
  changeReservation(
    userId: number,
    hotelId: number,
    newRoomId: number
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/change`, {
      userId,
      hotelId,
      newRoomId,
    });
  }

  /**
   * Books a room by sending the booking details to the backend.
   *
   * @param userId The ID of the user making the booking.
   * @param roomId The ID of the room to be booked.
   * @param checkIn The check-in date and time as a string.
   * @param checkOut The check-out date and time as a string.
   * @returns An Observable that emits the server's response.
   */
  bookRoom(
    userId: number,
    roomId: number,
    checkIn: string,
    checkOut: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/book`, {
      userId,
      roomId,
      checkIn,
      checkOut,
    });
  }
}
