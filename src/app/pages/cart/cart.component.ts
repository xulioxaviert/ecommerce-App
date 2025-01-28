import { DecimalPipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ShoppingCart } from '../../core/models/cart.model';
import { Users } from '../../core/models/user.model';
import { HttpService } from '../../core/services/http.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ NgFor, DecimalPipe, UpperCasePipe ],
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
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getIdFromUrl();
  }

  getIdFromUrl(): string {
    const url = this.router.url;
    const cartId = url.split('/');
    return cartId[ cartId.length - 1 ];
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

  addProduct(product: any): void { }

  navigateToProductDetail(id: string) {
    console.log('product', id);
    this.router.navigate([ `/product/detail/${id}` ]);
  }
  ngOnDestroy(): void { }

  decrementQuantity(id: number, size: any): void {
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

  incrementQuantity(id: number, size: any) {
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

  makePayment(): void {
    console.log('makePayment', this.shoppingCart);
    
    console.log('SubTotal', this.subTotal);
    console.log('Total', this.total);
    console.log('Tax', this.tax);
    console.log('Shipping', this.shipping);
  }
}
