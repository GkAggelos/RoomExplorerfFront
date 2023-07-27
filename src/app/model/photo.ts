import { Residence } from "./residence";

export interface Photo {
    id: number;
    url: string;
    residence: Residence;
}