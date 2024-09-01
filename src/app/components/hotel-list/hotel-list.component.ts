import { Component, OnInit } from '@angular/core';
import { IHotelWithRatings } from '../../models/IHotel';
import { HotelService } from '../../services/hotel/hotel.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit {
  hotels: IHotelWithRatings[] = [];
  radius: number = 10;
  userLat: number = 0;
  userLon: number = 0;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.getUserLocation();
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLat = position.coords.latitude;
        this.userLon = position.coords.longitude;
        this.getHotels();
      });
    }
  }

  getHotels(): void {
    this.hotelService
      .getHotelsWithinRadius(this.userLat, this.userLon, this.radius)
      .subscribe((response) => (this.hotels = response));
  }
}
