import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';
import { Observable } from 'rxjs';
import { MessageResponse } from '../model/messageResponse';
import { PageResponse } from '../model/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationUrl = 'https://localhost:8080/reservation';

  constructor(private http: HttpClient) { }

  public getReservationsByRenterId(id: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.reservationUrl}/find/renter/${id}`);
  }

  public getReservationsByHostId(id: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.reservationUrl}/find/host/${id}`);
  }

  public getReservationsByRenterIdPagination(id: number, page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.reservationUrl}/find/renter/${id}/${page}`);
  }

  public getReservationsByResidenceIdPagination(id: number, page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.reservationUrl}/find/residence/${id}/${page}`);
  }

  public getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.reservationUrl}/find/${id}`);
  }

  public updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.reservationUrl}/update`, reservation);
  }

  public addReservation(reservation: Reservation): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.reservationUrl}/add`, reservation);
  }
}
