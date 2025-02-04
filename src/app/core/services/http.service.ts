import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, take } from 'rxjs';
import { ENDPOINTS } from '../const/constants';
import { testimonials } from '../mocks/mock-data';
import { Testimonial } from '../models/testimonial.model';
import { Product } from '../models/cart.model';

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
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(ENDPOINTS.getAllProducts, this.options)
  }
  getProductsById(id: string): Observable<Product> {
    return this.http.get<Product>(`${ENDPOINTS.getAllProducts}/${id}`, this.options)
  }
  getAllCategories(): Observable<Product[]> {
    return this.http.get<Product[]>(ENDPOINTS.getAllCategories, this.options)
  }

  getTestimonials(): Observable<Testimonial[]> {
    return of(testimonials);
  }
}
