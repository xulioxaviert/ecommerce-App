import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);


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
}
