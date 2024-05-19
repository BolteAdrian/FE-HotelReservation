import { Room } from "./room";

export interface Hotel {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    rooms:Room[]
}