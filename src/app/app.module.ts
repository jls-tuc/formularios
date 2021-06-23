import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormWebComponent } from './pages/form-web/form-web.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { TokenInterceptorService } from './pages/services/token-interceptor.service';

@NgModule({
  declarations: [AppComponent, FormWebComponent],
  imports: [
    RouterModule.forRoot([]),
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot({
      siteKey: '6LeidU0bAAAAAOQ58mw9q6n8M7PoX_r9YH5OUAd-',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
