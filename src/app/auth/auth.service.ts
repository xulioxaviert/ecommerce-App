import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS } from '../core/const/constants';
import { Users } from '../core/models/user.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private _httpClient: HttpClient) { }

  login(username: string, password: string): Observable<string> {

    const url = ENDPOINTS.login; //
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    });

    const payload = {
      username: username,
      password: password
    };

    return this._httpClient.post<string>(url, payload, { headers });
  }

  setSessionStorage(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getSessionStorage(): string | null {
    return sessionStorage.getItem('token');
  }

}
