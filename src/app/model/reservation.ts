import { Renter } from "./renter";
import { Residence } from "./residence";

export interface Reservation {
    id: number;
    stars: number;
    review: string;
    reservationDate: string;
    arrivalDate: string;
    leaveDate: string;
    state: number;
    residence: Residence;
    renter: Renter;
}