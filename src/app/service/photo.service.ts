import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../model/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private photoUrl = 'http://localhost:8080/photo';

  constructor(private http: HttpClient) { }

  public addPhoto(photo: Photo): Observable<Photo> {
    return this.http.post<Photo>(`${this.photoUrl}/add`, photo);
  }

  public deletePhoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.photoUrl}/delete/${id}`);
  }

}
