import { Component, OnInit } from '@angular/core';
import { IHotelWithRatings } from '../../models/IHotel'; 
import { HotelService } from '../../services/hotel/hotel.service';

/**
 * The `HotelListComponent` is responsible for displaying a list of hotels
 * within a specified radius of the user's current location.
 */
@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit {
  hotels: IHotelWithRatings[] = []; // Array to store the list of hotels with ratings
  radius: number = 10; // Radius within which to search for hotels, in kilometers
  userLat: number = 0; // Latitude of the user's current location
  userLon: number = 0; // Longitude of the user's current location

  /**
   * Constructor for injecting dependencies.
   *
   * @param hotelService Handles operations related to fetching hotel data.
   */
  constructor(private hotelService: HotelService) {}

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   *
   * This method initiates the process of obtaining the user's location
   * and subsequently fetching the hotels within the specified radius.
   */
  ngOnInit(): void {
    this.getUserLocation(); // Start by getting the user's location
  }

  /**
   * Attempts to retrieve the user's current geographic location using the browser's geolocation API.
   *
   * If the location is successfully obtained, the latitude and longitude are stored
   * and the method to fetch nearby hotels is called.
   */
  getUserLocation(): void {
    if (navigator.geolocation) {
      // Check if the browser supports geolocation
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLat = position.coords.latitude; // Set user's latitude
        this.userLon = position.coords.longitude; // Set user's longitude
        this.getHotels(); // Fetch the hotels within the radius from the user's location
      });
    } else {
      console.warn('Geolocation is not supported by this browser.'); // Warn if geolocation is not supported
    }
  }

  /**
   * Fetches the list of hotels within a certain radius of the user's current location.
   *
   * The radius is specified by the `radius` property, and the method
   * updates the `hotels` array with the fetched data.
   */
  getHotels(): void {
    this.hotelService
      .getHotelsWithinRadius(this.userLat, this.userLon, this.radius) // Fetch hotels within the radius
      .subscribe((response) => (this.hotels = response)); // Update the hotels array with the response data
  }
}
