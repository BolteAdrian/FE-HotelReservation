import { IFeedback } from './IFeedback';
import { IRoom } from './IRoom';

export interface IHotelDetails {
  rooms: IRoom[];
  feedbacks: IFeedback[];
  hasReservation: boolean;
}
