import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const token = sessionStorage.getItem('token') ?? '';
    this.loadingService.isLoading$.next(true);

    if (token) {
      request = request.clone({
        setHeaders: {
          token: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error, caught) => {
        this.loadingService.isLoading$.next(false);
        console.log('error is intercept', error);
        this.toastService.showError('Error', error.error.message);
        return of(error);
        //  return this.handleAuthError(error);
      }),
      finalize(() => {
        this.loadingService.isLoading$.next(false);
      })
    );
  }
}
