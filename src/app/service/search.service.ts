import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Search } from '../model/search';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchUrl = 'https://localhost:8080/search-history';

  constructor(private http: HttpClient) { }

  public addSearch(search: Search): Observable<Search> {
    return this.http.post<Search>(`${this.searchUrl}/add`, search);
  }

  public deleteSearches(renterId: number): Observable<void> {
    return this.http.delete<void>(`${this.searchUrl}/delete/${renterId}`);
  }
}
