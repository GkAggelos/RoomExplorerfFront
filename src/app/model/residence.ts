import { Host } from "./host";
import { Reservation } from "./reservation";

export interface Residence {
    id: number;
    pricing: number;
    location: string;
    area: number;
    floor: number;
    peopleCapacity: number;
    roomType: number;
    comment: string;
    photo: string;
    host: Host;
    has_wifi: boolean;
    has_heating: boolean;
    has_air_condition: boolean;
    has_cuisine: boolean;
    has_tv: boolean;
    has_parking: boolean;
    has_elevator: boolean;
    reservations: Reservation[];
}