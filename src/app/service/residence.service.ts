import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Residence } from '../model/residence';
import { Photo } from '../model/photo';
import { PageResponse } from '../model/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private residenceUrl = 'http://localhost:8080/residence';

  constructor(private http: HttpClient) { }

  public getHostResidences(id: number): Observable<Residence[]> {
    return this.http.get<Residence[]>(`${this.residenceUrl}/find/host/${id}`);
  }

  public getHostResidencesPagination(id: number, page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.residenceUrl}/find/host/${id}/${page}`);
  }

  public addResidence(residence: Residence): Observable<Residence> {
    return this.http.post<Residence>(`${this.residenceUrl}/add`, residence);
  }

  public getResidenceById(id: number): Observable<Residence> {
    return this.http.get<Residence>(`${this.residenceUrl}/find/${id}`);
  }

  public getPhotosByResidenceId(id: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.residenceUrl}/find/photos/${id}`);
  }

  public updateResidence(residence: Residence): Observable<Residence> {
    return this.http.put<Residence>(`${this.residenceUrl}/update`, residence);
  }

  public deleteResidence(id: number): Observable<any> {
    return this.http.delete<any>(`${this.residenceUrl}/delete/${id}`);
  }

  public getResidencesBySearch(city: String, checkIn: String, checkOut: String, people: number): Observable<Residence[]> {
    return this.http.get<Residence[]>(`${this.residenceUrl}/search?city=${city}&arrivalDate=${checkIn}&leaveDate=${checkOut}&peopleCapacity=${people}`);
  }

}
