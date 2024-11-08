import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private loadingService: LoadingService, private toastService: ToastService) { }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // if (!request.url.includes('auth')) {
    // add authorization header with jwt token if available
    const token = sessionStorage.getItem('token') ?? '';
    this.loadingService.isLoading$.next(true);


    if (token) {
      request = request.clone({
        setHeaders: {
          token: `Bearer ${token}`,
        },
      });
    }
    return next
      .handle(request)
      .pipe(finalize(() => {
        this.loadingService.isLoading$.next(false)
      })
      );
    // catchError((error, caught) => {
    //   // intercept the respons error and displace it to the console
    //   this.handleAuthError(error);
    //   return of(error);
    // }),
    // finalize(() => this.loadingService.isLoading$.next(false))

    // }

    // return next.handle(request).pipe(
    //   catchError((error, caught) => {
    //     this.loadingService.isLoading$.next(false);
    //     return this.handleAuthError(error);
    //   }),
    //   finalize(() => this.loadingService.isLoading$.next(false))
    // );
  }
}
