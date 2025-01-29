import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShoppingCart } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-list',
  imports: [ UpperCasePipe ],
  standalone: true,
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent {
  @Input() shoppingCart: ShoppingCart;
  @Output() removeProduct: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() incrementQuantity: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() decrementQuantity: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() idProductDetail: EventEmitter<string> = new EventEmitter<string>();

  navigateToProductDetail(id: string): void {
    console.log("navigateToProductDetail / id:", id);
    this.idProductDetail.emit(id);
  }
}
