import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Residence } from '../model/residence';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private residenceUrl = 'http://localhost:8080/residence';

  constructor(private http: HttpClient) { }

  public getResidences(): Observable<Residence[]> {
    return this.http.get<Residence[]>(`${this.residenceUrl}/all`);
  }

  public addResidence(residence: Residence): Observable<Residence> {
    return this.http.post<Residence>(`${this.residenceUrl}/add`, residence);
  }

}
