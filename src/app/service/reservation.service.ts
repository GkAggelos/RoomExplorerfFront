import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationUrl = 'http://localhost:8080/reservation';

  constructor(private http: HttpClient) { }

  public getReservationsByRenterId(id: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.reservationUrl}/find/renter/${id}`);
  }

  public getReservationsByResidenceId(id: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.reservationUrl}/find/residence/${id}`);
  }

  public getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.reservationUrl}/find/${id}`);
  }

  public updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.reservationUrl}/update`, reservation);
  }

  public addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.reservationUrl}/add`, reservation);
  }
}
