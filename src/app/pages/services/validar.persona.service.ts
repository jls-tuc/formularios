import { Injectable } from '@angular/core';
import { getPersona } from '../interface/persona.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const API_USERS_URL = `${environment.apiUrl}/api/core/tm/persona`;

@Injectable({
  providedIn: 'root',
})
export class ValidarPersonaService {
  public _getPersona: getPersona;

  constructor(public http: HttpClient) {}

  getPersonaBD(persona: string) {
    return this.http.get(API_USERS_URL + `/?${persona}`); // retorna un observable con los mismos resultados del potman
  }

  getPersonaRenaper(persona: string) {
    let url = environment.apiUrl;
    return this.http.get(url + `/?${persona}`);
  }
}
