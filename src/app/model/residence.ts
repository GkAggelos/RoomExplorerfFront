import { Host } from "./host";
import { Photo } from "./photo";
import { Reservation } from "./reservation";

export interface Residence {
    id: number;
    available_from: string;
    available_till: string;
    pricing: number;
    location: string;
    area: number;
    floor: number;
    peopleCapacity: number;
    bedNumber: number;
    bathroomNumber: number;
    bedroomNumber: number;
    acreage: number;
    roomType: number;
    comment: string;
    description: string;
    photos: Photo[];
    host: Host;
    has_living_room: boolean;
    has_wifi: boolean;
    has_heating: boolean;
    has_air_condition: boolean;
    has_cuisine: boolean;
    has_tv: boolean;
    has_parking: boolean;
    has_elevator: boolean;
    reservations: Reservation[];
    photo: string;
}