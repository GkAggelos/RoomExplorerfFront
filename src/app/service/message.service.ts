import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../model/message';
import { Observable } from 'rxjs';
import { PageResponse } from '../model/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageUrl = 'https://localhost:8080/message';

  constructor(private http: HttpClient) {}

  public addMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.messageUrl}/add`, message);
  }

  public deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.messageUrl}/delete/${id}`);
  }

  public getMessagesByResidenceIdPegination(residence_id: number, page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.messageUrl}/find/residence/${residence_id}/${page}`);
  }

  public getMessagesByRenterIdPegination(renter_id: number, page: number): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.messageUrl}/find/renter/${renter_id}/${page}`);
  }

  public getMessageById(id: number) : Observable<Message> {
    return this.http.get<Message>(`${this.messageUrl}/find/${id}`);
  }

}
