import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel/hotel.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IRoom } from 'src/app/models/IRoom';
import { IFeedback } from 'src/app/models/IFeedback';

/**
 * The `HotelDetailComponent` handles the display and interaction
 * with the details of a specific hotel, including available rooms,
 * user feedback, and reservation functionalities.
 */
@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
})
export class HotelDetailComponent implements OnInit {
  rooms: IRoom[] = []; // List of all rooms available in the hotel
  filteredRooms: any[] = []; // List of rooms filtered based on check-in and check-out dates
  feedbacks: IFeedback[] = []; // List of feedbacks given by users for the hotel
  id: number = Number(this.route.snapshot.paramMap.get('id')!); // Hotel ID from the route parameter
  userId: number = 0; // ID of the currently logged-in user
  comment: string = ''; // Comment input for feedback
  rating: number = 0; // Rating input for feedback
  newRoomId: number = 0; // ID of the new room selected for changing reservation
  showFeedbackForm: boolean = false; // Flag to show or hide the feedback form
  hasReservation: boolean = false; // Flag to indicate if the user has an existing reservation
  isModalOpen: boolean = false; // Flag to control the visibility of the booking confirmation modal
  isChangeModalOpen: boolean = false; // Flag to control the visibility of the change reservation modal
  selectedRoomId: number | null = null; // ID of the room selected for booking or reservation change

  checkInDate: string = ''; // User's selected check-in date
  checkOutDate: string = ''; // User's selected check-out date

  /**
   * Constructor for injecting dependencies.
   *
   * @param route Provides access to information about a route associated with a component loaded in an outlet.
   * @param hotelService Handles operations related to hotels, such as fetching details and managing reservations.
   * @param authService Handles authentication and provides user information.
   * @param router Enables navigation between different views in the application.
   */
  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   *
   * This method retrieves the user ID and loads the hotel details when the component is initialized.
   */
  ngOnInit(): void {
    this.userId = Number(this.authService.getUserId()); // Get the user ID from the authentication service
    this.getHotel(); // Fetch hotel details and associated information
  }

  /**
   * Fetches the details of the hotel, including available rooms, feedbacks, and user's reservation status.
   */
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

  /**
   * Triggered when the check-in or check-out date changes.
   * Re-fetches the hotel details to update the available rooms.
   */
  onDateChange(): void {
    this.getHotel(); // Reload hotel data when dates change
  }

  /**
   * Filters the rooms based on the selected check-in and check-out dates.
   *
   * @param rooms List of rooms to filter.
   * @returns Filtered list of rooms that are available within the selected date range.
   */
  filterRooms(rooms: any[]): any[] {
    if (!this.checkInDate || !this.checkOutDate) {
      return rooms;
    }

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    return rooms.filter((room) => {
      // Assume that room.availableDates is an array of available date ranges
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

  /**
   * Opens the booking confirmation modal.
   *
   * @param roomId The ID of the room to be booked.
   */
  openConfirmationModal(roomId: number): void {
    this.selectedRoomId = roomId; // Set the selected room ID for booking
    this.isModalOpen = true; // Open the confirmation modal
  }

  /**
   * Closes the booking confirmation modal.
   */
  closeConfirmationModal(): void {
    this.isModalOpen = false; // Close the confirmation modal
    this.selectedRoomId = null; // Reset the selected room ID
  }

  /**
   * Opens the change reservation modal.
   *
   * @param roomId The ID of the new room for the reservation change.
   */
  openConfirmatioChangenModal(roomId: number): void {
    this.selectedRoomId = roomId; // Set the selected room ID for reservation change
    this.isChangeModalOpen = true; // Open the change reservation modal
  }

  /**
   * Closes the change reservation modal.
   */
  closeConfirmatioChangenModal(): void {
    this.isChangeModalOpen = false; // Close the change reservation modal
    this.selectedRoomId = null; // Reset the selected room ID
  }

  /**
   * Confirms the booking of the selected room.
   */
  confirmBooking(): void {
    if (this.selectedRoomId) {
      this.bookRoom(this.selectedRoomId); // Proceed with booking the selected room
      this.closeConfirmationModal(); // Close the confirmation modal
    }
  }

  /**
   * Books a room for the user based on their selected check-in and check-out dates.
   *
   * @param roomId The ID of the room to be booked.
   */
  bookRoom(roomId: number): void {
    const checkIn = new Date(this.checkInDate).toISOString();
    const checkOut = new Date(this.checkOutDate).toISOString();

    this.hotelService
      .bookRoom(this.userId, roomId, checkIn, checkOut)
      .subscribe(
        () => {
          this.getHotel(); // Refresh hotel details after booking
        },
        (error) => {
          console.error('Booking failed', error); // Log any errors during booking
        }
      );
  }

  /**
   * Confirms the change of reservation to a new room.
   */
  confirmChange(): void {
    if (this.selectedRoomId) {
      this.changeReservation(this.selectedRoomId); // Proceed with changing the reservation
      this.closeConfirmatioChangenModal(); // Close the change reservation modal
    }
  }

  /**
   * Changes the user's reservation to a new room.
   *
   * @param newRoomId The ID of the new room to switch to.
   */
  changeReservation(newRoomId: number): void {
    this.hotelService
      .changeReservation(this.userId, this.id, newRoomId)
      .subscribe(() => {
        this.getHotel(); // Refresh hotel details after reservation change
      });
  }

  /**
   * Allows the user to leave feedback for the hotel.
   *
   * @param comment The user's feedback comment.
   * @param rating The user's rating for the hotel.
   */
  leaveFeedback(comment: string, rating: number): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']); // Redirect to login if the user is not authenticated
      return;
    }

    this.hotelService
      .leaveFeedback(this.id, this.userId, comment, rating)
      .subscribe(() => {
        this.getHotel(); // Refresh hotel details after feedback submission
        this.showFeedbackForm = false;
        this.rating = 0;
        this.comment = '';
      });
  }
}
