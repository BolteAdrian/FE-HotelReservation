import { IRoom } from './IRoom';

export interface IHotel {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  rooms: IRoom[];
}

export interface IHotelWithRatings {
  hotel: IHotel;
  averageRating: number;
}
