import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  reservations: any[] = [];
  isModalOpen: boolean = false;
  selectedReservationId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.getUserReservations();
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((data) => {
      this.user = data;
    });
  }

  getUserReservations() {
    this.userService.getUserReservations().subscribe((data) => {
      this.reservations = data;
    });
  }

  openConfirmationModal(reservationId: number) {
    this.selectedReservationId = reservationId;
    this.isModalOpen = true;
  }

  closeConfirmationModal() {
    this.isModalOpen = false;
    this.selectedReservationId = null;
  }

  confirmCancel() {
    if (this.selectedReservationId !== null) {
      this.userService
        .cancelReservation(this.selectedReservationId)
        .subscribe(() => {
          this.getUserReservations(); // Refresh the list after cancellation
        });
    }
    this.closeConfirmationModal();
  }
}
