import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getHotelsWithinRadius(lat: number, lon: number, radius: number): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.baseUrl}/hotels/withinRadius?userLat=${lat}&userLon=${lon}&radius=${radius}`);
  }

  getRoomsByHotelId(id: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/hotels/${id}/rooms`);
  }

  bookRoom(userId: number, roomId: number, checkIn: string, checkOut: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/book`, { userId, roomId, checkIn, checkOut });
  }

  cancelReservation(reservationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/cancel`, { reservationId });
  }

  changeReservation(reservationId: number, newRoomId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/change`, { reservationId, newRoomId });
  }

  leaveFeedback(hotelId: number, userId: number, comment: string, rating: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/hotels/${hotelId}/feedback`, { userId, comment, rating });
  }
}
