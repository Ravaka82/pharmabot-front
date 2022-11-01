import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TokenService} from "./token.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private token: TokenService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    try {
      const token = this.token.getToken();
      if (!!token) {
        const cloned = request.clone({
          headers: request.headers.set("x-access-token", token)
        });
        return next.handle(cloned);
      }
      throw new Error('Token invalid.');
    } catch(error) {
      this.router.navigateByUrl('/auth/login');
      this.token.removeToken();
      return next.handle(request);
    }
  }
}
