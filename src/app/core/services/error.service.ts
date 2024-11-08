import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toast: ToastService) { }

  /**
   * Prints error
   * Método para pintar los errores desde api.
   * @param error
   */
  printError(error: HttpErrorResponse) {
    this.toast.showToast('error', 'Error', error.message);
  }
}
