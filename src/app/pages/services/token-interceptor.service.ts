import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req, next) {
    let token = req.clone({
      setHeaders: {
        Authorization:
          '',
      },
    });
    return next.handle(token);
  }
}
