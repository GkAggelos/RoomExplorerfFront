import { Renter } from "./renter";
import { Residence } from "./residence";

export interface Message {
    id: number;
    residence: Residence;
    renter: Renter;
    message: string;
    sender: string;
    date: string;
}