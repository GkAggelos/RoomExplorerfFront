import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Renter } from '../model/renter';
import { PageResponse } from '../model/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class RenterService {
  private renterUrl = 'https://localhost:8080/renter';

  constructor(private http: HttpClient) { }

  public getRentersPagination(page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.renterUrl}/all/${page}`);
  }

  public getUsernames(): Observable<String[]> {
    return this.http.get<String[]>(`${this.renterUrl}/find/all/usernames`);
  }

  public getEmails(): Observable<String[]> {
    return this.http.get<String[]>(`${this.renterUrl}/find/all/emails`);
  }

  public getRenterById(id: number): Observable<Renter> {
    return this.http.get<Renter>(`${this.renterUrl}/find?id=${id}`);
  }
}
