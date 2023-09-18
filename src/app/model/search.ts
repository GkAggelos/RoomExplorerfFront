import { Renter } from "./renter";
import { Residence } from "./residence";


export interface Search {
    id: number;
    renter: Renter;
    residence: Residence;
}