import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel/hotel.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
})
export class HotelDetailComponent implements OnInit {
  rooms: any[] = [];
  filteredRooms: any[] = [];
  feedbacks: any[] = [];
  id: number = Number(this.route.snapshot.paramMap.get('id')!);
  userId: number = 0;
  comment: string = '';
  rating: number = 0;
  newRoomId: number = 0;
  showFeedbackForm: boolean = false;
  hasReservation: boolean = false;
  isModalOpen: boolean = false;
  isChangeModalOpen: boolean = false;
  selectedRoomId: number | null = null;

  checkInDate: string = '';
  checkOutDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.authService.getUserId());
    this.getHotel();
  }

  getHotel(): void {
    this.hotelService
      .getDetailsByHotelId(
        this.id,
        this.userId,
        this.checkInDate,
        this.checkOutDate
      )
      .subscribe((response) => {
        this.rooms = response.rooms;
        this.filteredRooms = this.rooms;
        this.feedbacks = response.feedbacks;
        this.hasReservation = response.hasReservation;
      });
  }

  onDateChange(): void {
    this.getHotel(); // Reîncarcă datele când datele se schimbă
  }

  filterRooms(rooms: any[]): any[] {
    if (!this.checkInDate || !this.checkOutDate) {
      return rooms;
    }

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    return rooms.filter((room) => {
      // Asumăm că room.availableDates este un array de intervale de date disponibile
      return room.availableDates.some(
        (dateRange: {
          start: string | number | Date;
          end: string | number | Date;
        }) =>
          new Date(dateRange.start) <= checkIn &&
          new Date(dateRange.end) >= checkOut
      );
    });
  }

  openConfirmationModal(roomId: number): void {
    this.selectedRoomId = roomId;
    this.isModalOpen = true;
  }

  closeConfirmationModal(): void {
    this.isModalOpen = false;
    this.selectedRoomId = null;
  }

  openConfirmatioChangenModal(roomId: number): void {
    this.selectedRoomId = roomId;
    this.isChangeModalOpen = true;
  }

  closeConfirmatioChangenModal(): void {
    this.isChangeModalOpen = false;
    this.selectedRoomId = null;
  }

  confirmBooking(): void {
    if (this.selectedRoomId) {
      this.bookRoom(this.selectedRoomId);
      this.closeConfirmationModal();
    }
  }

  bookRoom(roomId: number): void {
    const checkIn = new Date(this.checkInDate).toISOString();
    const checkOut = new Date(this.checkOutDate).toISOString();

    this.hotelService
      .bookRoom(this.userId, roomId, checkIn, checkOut)
      .subscribe(
        () => {
          this.getHotel();
        },
        (error) => {
          console.error('Booking failed', error);
        }
      );
  }

  confirmChange(): void {
    if (this.selectedRoomId) {
      this.changeReservation(this.selectedRoomId);
      this.closeConfirmatioChangenModal();
    }
  }

  changeReservation(newRoomId: number): void {
    this.hotelService
      .changeReservation(this.userId, this.id, newRoomId)
      .subscribe(() => {
        this.getHotel();
      });
  }

  leaveFeedback(comment: string, rating: number): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.hotelService
      .leaveFeedback(this.id, this.userId, comment, rating)
      .subscribe(() => {
        this.getHotel();
      });
  }
}
