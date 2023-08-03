import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../model/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  public getAdminById(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.adminUrl}/find/${id}`);
  }
}
