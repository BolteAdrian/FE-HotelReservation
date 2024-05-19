import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../services/hotel.service';

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
    private hotelService: HotelService
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
    const checkIn = new Date().toISOString(); // Utilizați date reale pentru check-in
    const checkOut = new Date().toISOString(); // Utilizați date reale pentru check-out
    this.hotelService
      .bookRoom(this.userId, roomId, checkIn, checkOut)
      .subscribe(() => {
        // Reîmprospătați lista camerelor după rezervare
        this.getHotel();
      });
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

  leaveFeedback(userId: number, comment: string, rating: number): void {
    // Verificați dacă rating-ul este în intervalul corect (1-5)
    if (rating < 1 || rating > 5) {
      // Afisati un mesaj de eroare sau gestionati altfel cazul in care rating-ul nu este valid
      console.error('Rating must be between 1 and 5');
      return;
    }

    this.hotelService
      .leaveFeedback(this.id, userId, comment, rating)
      .subscribe(() => {
        // Reîmprospătați lista camerelor după lăsare feedback
        this.getHotel();
        // Afișați un mesaj de succes sau faceți altă acțiune necesară
        console.log('Feedback submitted successfully');
      });
  }
}
