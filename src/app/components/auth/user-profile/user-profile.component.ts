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

  constructor(
    private userService: UserService,
  ) {}

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

  cancelReservation(reservationId: number) {
    this.userService.cancelReservation(reservationId).subscribe(() => {
      this.getUserReservations(); // Actualizează lista după anulare
    });
  }
}
