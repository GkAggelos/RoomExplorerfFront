import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Host } from './model/host';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private hostUrl = 'http://localhost:8080/host';

  constructor(private http: HttpClient) { }

  public getHosts(): Observable<Host[]> {
    return this.http.get<Host[]>(`${this.hostUrl}/all`);
  }

  public addHost(host: Host): Observable<Host> {
    return this.http.post<Host>(`${this.hostUrl}/add`, host);
  }
}
