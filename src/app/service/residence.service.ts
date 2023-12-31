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
  private residenceUrl = 'https://localhost:8080/residence';

  constructor(private http: HttpClient) { }

  public getHostResidences(id: number): Observable<Residence[]> {
    return this.http.get<Residence[]>(`${this.residenceUrl}/find/host/${id}`);
  }

  public getHostResidencesPagination(id: number, page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.residenceUrl}/find/host/page/${page}?id=${id}`);
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

  public getResidencesBySearchPaginationFilter(city: String, checkIn: String, checkOut: String, people: number, page: number, roomType: string, parking: boolean, livingRoom: boolean, 
    wifi: boolean, heating: boolean, airCondition: boolean, cuisine: boolean, tv: boolean, elevator: boolean, price: string): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.residenceUrl}/search/filter/${page}?city=${city}&arrivalDate=${checkIn}&leaveDate=${checkOut}&peopleCapacity=${people}&roomType=${roomType}&parking=${parking}&livingRoom=${livingRoom}&wifi=${wifi}&heating=${heating}&airCondition=${airCondition}&cuisine=${cuisine}&tv=${tv}&elevator=${elevator}&price=${price}`);
  }

  public getRecommendedResidencesByRenterId(id: number): Observable<Residence[]> {
    return this.http.get<Residence[]>(`${this.residenceUrl}/recommendations/${id}`);
  }
}
