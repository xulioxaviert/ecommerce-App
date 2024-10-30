import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../core/models/user.model';
import { ENDPOINTS } from '../core/const/constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _httpClient : HttpClient) { }

  getUsers(id: number): Observable<Users> {
    return this._httpClient.get<Users>(`${ENDPOINTS.getUser}${id}`);
  }

  getAllUsers(): Observable<Users[]> {
    return this._httpClient.get<Users[]>(ENDPOINTS.getAllUsers);
  }


}
