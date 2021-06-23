import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { formWeb } from '../interface/formWeb.interface';

const API_USERS_URL = `${environment.apiUrl}/api/modules/justicia-virtual/persona`;

@Injectable({
  providedIn: 'root',
})
export class FormWebService {
  constructor(private http: HttpClient) {}

  crearForm(formData: formWeb) {
    return this.http.post(API_USERS_URL, formData);
  }
}
