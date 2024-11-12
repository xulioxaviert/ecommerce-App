import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, take } from 'rxjs';
import { ENDPOINTS } from '../const/constants';
import { Products } from '../models/products.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);
  options: {};


  constructor(private _http: HttpClient) { }


  getData(url: string, params?: HttpParams): Observable<any> {
    return this.http
      .get<any[]>(url, {
        observe: 'response',
        params,
      })
      .pipe(
        take(1),
        catchError((err) => {
          return of(err);
        })
      );
  }
  getAllProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(ENDPOINTS.getAllProducts, this.options)
  }
  getAllCategories(): Observable<Products[]> {
    return this.http.get<Products[]>(ENDPOINTS.getAllCategories, this.options)
  }
}
