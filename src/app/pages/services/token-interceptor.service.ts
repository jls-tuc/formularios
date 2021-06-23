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
          'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJmb3JtdWxhcmlvcyIsIm9yZ2FuaXphY2lvbiI6IjVmMTc0YjAwYjQ5MDUwNDZiOGZhYmU5ZSIsInR5cGUiOiJhcHAtdG9rZW4iLCJpYXQiOjE2MjEwOTU3MTYsImV4cCI6MTYzNjY0NzcxNn0.Tx-9PG86Y4FdQmLNty_r4RWfqyJO_tSyTUGR4kHmZRE',
      },
    });
    return next.handle(token);
  }
}
