import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShoppingCart } from '../../../core/models/cart.model';

@Component({
  selector: 'app-order-summary',
  imports: [ DecimalPipe ],
  standalone: true,
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  @Input() total: number;
  @Input() shipping: number;
  @Input() tax: number;
  @Input() subTotal: number;
  @Input() cartProductTotal: number;
  @Input() shoppingCart: ShoppingCart;
  @Output() payShoppingCart: EventEmitter<ShoppingCart> = new EventEmitter<ShoppingCart>();


  makePayment(): void {
    this.payShoppingCart.emit(this.shoppingCart);
  }
}
