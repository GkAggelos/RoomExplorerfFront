import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Host } from '../model/host';
import { PageResponse } from '../model/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private hostUrl = 'https://localhost:8080/host';

  constructor(private http: HttpClient) { }

  public getHosts(): Observable<Host[]> {
    return this.http.get<Host[]>(`${this.hostUrl}/all`);
  }

  public getHostsPagination(page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.hostUrl}/all/${page}`);
  }

  public getUsernames(): Observable<String[]> {
    return this.http.get<String[]>(`${this.hostUrl}/find/all/usernames`);
  }

  public getEmails(): Observable<String[]> {
    return this.http.get<String[]>(`${this.hostUrl}/find/all/emails`);
  }

  public getHostById(id: number): Observable<Host> {
    return this.http.get<Host>(`${this.hostUrl}/find?id=${id}`);
  }

  public addHost(host: Host): Observable<Host> {
    return this.http.post<Host>(`${this.hostUrl}/add`, host);
  }

  public updateHost(host: Host): Observable<Host> {
    return this.http.put<Host>(`${this.hostUrl}/update`, host);
  }

}
