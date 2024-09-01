import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

/**
 * The `UserProfileComponent` manages the display and interaction
 * with the user's profile, including their personal details and reservations.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  // Properties to store user information and their reservations
  user: any = {}; // Holds the details of the currently logged-in user
  reservations: any[] = []; // Stores the list of reservations made by the user
  isModalOpen: boolean = false; // Controls the visibility of the confirmation modal
  selectedReservationId: number | null = null; // Holds the ID of the reservation to be cancelled

  /**
   * Constructor for injecting dependencies.
   *
   * @param userService The service responsible for user-related operations such as fetching details and reservations
   */
  constructor(private userService: UserService) {}

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   *
   * This method fetches the user's details and their reservations once the component is ready.
   */
  ngOnInit(): void {
    this.getUserDetails(); // Fetch the user's details on initialization
    this.getUserReservations(); // Fetch the user's reservations on initialization
  }

  /**
   * Fetches the details of the currently logged-in user from the server.
   *
   * The retrieved data is then stored in the `user` property.
   */
  getUserDetails() {
    this.userService.getUserDetails().subscribe((data) => {
      this.user = data;
    });
  }

  /**
   * Fetches the list of reservations made by the currently logged-in user.
   *
   * The retrieved data is then stored in the `reservations` property.
   */
  getUserReservations() {
    this.userService.getUserReservations().subscribe((data) => {
      this.reservations = data;
    });
  }

  /**
   * Opens the confirmation modal for cancelling a reservation.
   *
   * @param reservationId The ID of the reservation to be cancelled.
   */
  openConfirmationModal(reservationId: number) {
    this.selectedReservationId = reservationId; // Set the ID of the reservation to be cancelled
    this.isModalOpen = true; // Open the modal
  }

  /**
   * Closes the confirmation modal without cancelling any reservations.
   */
  closeConfirmationModal() {
    this.isModalOpen = false; // Close the modal
    this.selectedReservationId = null; // Reset the selected reservation ID
  }

  /**
   * Confirms the cancellation of the selected reservation.
   *
   * This method calls the service to cancel the reservation and then refreshes
   * the list of reservations to reflect the cancellation.
   */
  confirmCancel() {
    if (this.selectedReservationId !== null) {
      // Proceed with the cancellation if a reservation ID is selected
      this.userService
        .cancelReservation(this.selectedReservationId)
        .subscribe(() => {
          this.getUserReservations(); // Refresh the reservation list after cancellation
        });
    }
    this.closeConfirmationModal(); // Close the modal after confirmation
  }
}
