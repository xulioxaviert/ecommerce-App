import { DecimalPipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { Product, ShoppingCart } from '../../core/models/cart.model';
import { Users } from '../../core/models/user.model';
import { UsersService } from '../../users/users.service';
import { CartListComponent } from "./cart-list/cart-list.component";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ NgFor, DecimalPipe, UpperCasePipe, CartListComponent, OrderSummaryComponent ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  shoppingCart: ShoppingCart = {} as ShoppingCart;
  total: number = 0;
  shipping: number = 4;
  tax: number = 0;
  subTotal: number = 0;
  cartProductTotal: number = 1;
  user: Users;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getIdFromUrl();
    this.getData();
  }

  getIdFromUrl(): string {
    const url = this.router.url;
    const cartId = url.split('/');
    const id = cartId[ cartId.length - 1 ];
    if (id === '0') {
      const localStorageCart = localStorage.getItem('shoppingCart');
      if (localStorageCart) {
        this.shoppingCart = JSON.parse(localStorageCart);
        this.shoppingCartCalculation(this.shoppingCart);
      }
      return '0';
    }
    return id;
  }

  getData(): void {
    if (this.authService.isAuthenticated()) {
      this.usersService
        .getShoppingCartById(this.getIdFromUrl())
        .subscribe((shoppingCart: ShoppingCart) => {
          console.log('.subscribe / shoppingCart:', shoppingCart);
          this.shoppingCart = shoppingCart;
          this.shoppingCartCalculation(shoppingCart);
        });
    } else {
      this.router.navigate([ '/login' ]);
    }
  }

  shoppingCartCalculation(shoppingCart: any) {
    this.subTotal = shoppingCart.products.reduce(
      (total: number, product: any) =>
        (total += product.quantity * product.price),
      0
    );
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }

  removeProduct(event: Event): void {
    console.log('removedProduct', event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro que deseas eliminar el producto?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
      reject: () => { },
    });

  }

  navigateToProductDetail(id: string): void {
    console.log('product', id);
    this.router.navigate([ `/product/detail/${id}` ]);
  }
  ngOnDestroy(): void { }

  decrementQuantity(event: { id: number, size: any }): void {
    const { id, size } = event;

    this.shoppingCart.products.forEach((product) => {
      if (product.productId === id) {
        if (product.type === 'composite') {
          product.properties.forEach((property) => {
            property.size.forEach((s) => {
              if (s.size === size.size) {
                if (s.quantity <= 0) return s;
                s.quantity -= 1;
                product.quantity -= 1;
              }
              return s;
            });
          });
        } else if (product.type === 'simple') {
          if (product.quantity <= 0) return product;
          product.quantity -= 1;
        }
      }
      return product;
    });
    this.subTotal = this.shoppingCart.products.reduce(
      (total: number, product: any) =>
        (total += product.quantity * product.price),
      0
    );
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }

  incrementQuantity(event: { id: number, size: any }) {
    const { id, size } = event;

    this.shoppingCart.products = this.shoppingCart.products.map((product) => {
      if (product.productId === id) {
        if (product.type === 'composite') {
          product.properties.forEach((property) => {
            property.size.forEach((s) => {
              if (s.size === size.size) {
                s.quantity += 1;
                product.quantity += 1;
              }
              return s;
            });
          });
        } else if (product.type === 'simple') {
          product.quantity += 1;
        }
      }
      return product;
    });
    this.subTotal = this.shoppingCart.products.reduce(
      (total: number, product: any) =>
        (total += product.quantity * product.price),
      0
    );

    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }

  makePayment(shoppingCart: ShoppingCart): void {
    const payload = JSON.parse(JSON.stringify(shoppingCart));
    payload.products.forEach((product: Product) => {
      if (product.type === 'composite') {
        product.properties.forEach((property) => {
          property.size = property.size.filter(s => s.quantity > 0);
        });
        if (product.properties.every(property => property.size.length === 0)) {
          payload.products = payload.products.filter((p: Product) => p.productId !== product.productId);
        }
      } else if (product.type === 'simple') {
        if (product.quantity <= 0) {
          payload.products = payload.products.filter((p: Product) => p.productId !== product.productId);
        }
      }
    });
    console.log('payload', payload);
    this.usersService.putShoppingCart(this.shoppingCart.id, payload).subscribe((cart) => {
      console.log('cart', cart);
      this.usersService.shoppingCart$.next(cart);

      this.router.navigate([ '/checkout', this.shoppingCart.id ]);
    })

  }
}
