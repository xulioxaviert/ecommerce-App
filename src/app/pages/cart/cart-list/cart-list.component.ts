import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShoppingCart } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-list',
  imports: [ UpperCasePipe, NgIf, NgFor ],
  standalone: true,
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent {
  @Input() shoppingCart: ShoppingCart;
  @Output() removeProduct: EventEmitter<string> = new EventEmitter<string>();
  @Output() decrementQuantity: EventEmitter<{ id: number, size: any }> = new EventEmitter<{ id: number, size: any }>();
  @Output() incrementQuantity: EventEmitter<{ id: number, size: any }> = new EventEmitter<{ id: number, size: any }>();
  @Output() idProductDetail: EventEmitter<string> = new EventEmitter<string>();

  navigateToProductDetail(id: string): void {
    this.idProductDetail.emit(id);
  }

  decrementQuantityProduct(id: number, size: any): void {
    this.decrementQuantity.emit( {id, size} );
  }
  incrementQuantityProduct(id: number, size: any): void {
    this.incrementQuantity.emit( {id, size} );
  }

  removeProductFromCart(id: string): void {
    this.removeProduct.emit(id);
  }


}
