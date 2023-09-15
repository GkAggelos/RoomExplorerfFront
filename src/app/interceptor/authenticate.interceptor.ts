import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticateInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const localToken = localStorage.getItem("token");
    console.log(localToken);
    if (request.url !== "https://localhost:8080/host/find/all/usernames" &&
    request.url !== "https://localhost:8080/renter/find/all/usernames" &&
    request.url !== "https://localhost:8080/host/find/all/emails" &&
    request.url !== "https://localhost:8080/renter/find/all/emails" &&
    request.url !== "https://localhost:8080/api/v1/auth/register" &&
    request.url !== "https://localhost:8080/api/v1/auth/authenticate" &&
    localToken !== null) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + localToken)});
    }
    return next.handle(request);
  }
}
