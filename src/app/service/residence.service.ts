import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Residence } from '../model/residence';
import { Photo } from '../model/photo';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private residenceUrl = 'http://localhost:8080/residence';

  constructor(private http: HttpClient) { }

  public getHostResidences(id: number): Observable<Residence[]> {
    return this.http.get<Residence[]>(`${this.residenceUrl}/find/host/${id}`);
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

}
