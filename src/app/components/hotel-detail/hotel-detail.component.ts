import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../services/hotel/hotel.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
})
export class HotelDetailComponent implements OnInit {
  rooms: any[] = [];
  id: number = Number(this.route.snapshot.paramMap.get('id')!);
  userId: number = 1; // ID-ul utilizatorului (ar putea fi preluat din autentificare)
  comment: string = '';
  rating: number = 0;
  newRoomId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getHotel();
  }

  getHotel(): void {
    this.hotelService.getRoomsByHotelId(this.id).subscribe((response) => {
      // Inițializăm proprietatea showFeedbackForm pentru fiecare cameră
      this.rooms = response.map((room) => ({
        ...room,
        showFeedbackForm: false,
      }));
    });
  }

  bookRoom(roomId: number): void {
    if (!this.authService.getToken()) {
      alert('Please log in to book a room.');
      return;
    }

    const checkIn = new Date().toISOString();
    const checkOut = new Date().toISOString();

    this.hotelService
      .bookRoom(this.userId, roomId, checkIn, checkOut)
      .subscribe(
        () => {
          this.getHotel();
        },
        (error) => {
          console.error('Booking failed', error);
          alert('Booking failed. Please try again.');
        }
      );
  }

  cancelReservation(reservationId: number): void {
    this.hotelService.cancelReservation(reservationId).subscribe(() => {
      // Reîmprospătați lista camerelor după anulare
      this.getHotel();
    });
  }

  changeReservation(reservationId: number, newRoomId: number): void {
    this.hotelService
      .changeReservation(reservationId, newRoomId)
      .subscribe(() => {
        // Reîmprospătați lista camerelor după schimbare
        this.getHotel();
      });
  }

  leaveFeedback(room: any, comment: string, rating: number): void {
    if (!this.authService.getToken()) {
      alert('Please log in to leave feedback.');
      return;
    }

    this.hotelService
      .leaveFeedback(this.id, this.userId, comment, rating)
      .subscribe(() => {
        this.getHotel();
        alert('Feedback submitted successfully');
      });
  }
}
