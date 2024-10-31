import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastModule } from 'primeng/toast';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastr: ToastModule) { }

  /**
   * Prints error
   * Método para pintar los errores desde api.
   * @param error
   */
  printError(error: HttpErrorResponse) {
    // this.toastr.error(String(error.message), 'Error');
  }
}
