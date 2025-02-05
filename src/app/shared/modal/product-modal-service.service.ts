import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from '../../core/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSource = new BehaviorSubject<Product>({} as Product);
  openModal$ = this.openModalSource.asObservable();

  openModal(product: Product): void {
    this.openModalSource.next(product);
  }
}
