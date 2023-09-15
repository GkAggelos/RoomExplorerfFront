import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../model/register';
import { Authenticate } from '../model/authenticate';
import { Jwt } from '../model/Jwt';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAuthUrl = 'https://localhost:8080/api/v1/auth';
  private userUrl = 'https://localhost:8080/user'

  constructor(private http: HttpClient) { }

  public  registerUser(register: Register): Observable<Jwt> {
    return this.http.post<Jwt>(`${this.userAuthUrl}/register`, register);
  }

  public authenticateUser(authenticate: Authenticate): Observable<Jwt> {
    return this.http.post<Jwt>(`${this.userAuthUrl}/authenticate`, authenticate);
  }

  public updateUser(user: User, role: string, username: string): Observable<Jwt> {
    return this.http.put<Jwt>(`${this.userUrl}/update/${role}/${username}`, user);
  }

  public logOutUser(): Observable<any> {
    return this.http.delete<any>(`${this.userAuthUrl}/logout`);
  }

  public deleteUser(role: string, username: string): Observable<any> {
    return this.http.delete<any>(`${this.userUrl}/delete/${role}/${username}`);
  }
}
