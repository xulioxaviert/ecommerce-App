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
    let subTotal = 0;
    let cartProductTotal = 0;

    this.tax = this.subTotal * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
    console.log('this.shoppingCart', this.shoppingCart);
  }

  addProduct(product: any): void { }

  navigateToProductDetail(id: string) {
    console.log('product', id);
    this.router.navigate([ `/product/detail/${id}` ]);
  }
  ngOnDestroy(): void { }

  decrementQuantity(id: number, size: any): void {
    console.log('decrementQuantity', id, size);
    this.shoppingCart.products = this.shoppingCart.products.map((products) => {
      if (products.productId === id) {
        products.properties[ 0 ].size = products.properties[ 0 ].size.map((s: any) => {
          if (s.size === size.size) {
            if (s.quantity <= 0) return s;
            s.quantity -= 1;
          }
          return s;
        });
      }
      return products;
    });
    this.shoppingCart.products[ 0 ].quantity = this.shoppingCart.products[ 0 ].properties[ 0 ].size.reduce((total: number, s: any) => total += s.quantity, 0);

    this.subTotal = this.shoppingCart.products[ 0 ].quantity * this.shoppingCart.products[ 0 ].price;
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;

  }

  incrementQuantity(id: number, size: any) {
    console.log("incrementQuantity / id:", id);
    this.shoppingCart.products = this.shoppingCart.products.map((products) => {
      if (products.productId === id) {
        products.properties[ 0 ].size = products.properties[ 0 ].size.map((s: any) => {
          if (s.size === size.size) {
            if (s.quantity <= 0) return s;
            s.quantity += 1;
          }
          return s;
        });
      }
      return products;
    });
    this.shoppingCart.products[ 0 ].quantity = this.shoppingCart.products[ 0 ].properties[ 0 ].size.reduce((total: number, s: any) => total += s.quantity, 0);

    this.subTotal = this.shoppingCart.products[ 0 ].quantity * this.shoppingCart.products[ 0 ].price;
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }


  // makePayment(): void {
  //   if(this.authService.isAuthenticated()) {
  //   const user = this.authService.getSessionStorage('user');
  //   console.log("makePayment / user:", this.shoppingCart);
  //   let newShoppingCart: ShoppingCart = {} as ShoppingCart;
  //   // this.usersService.getShoppingCartByUserId(this.user.userId).subscribe((shoppingCart: any) => {
  //   //   newShoppingCart = shoppingCart[ 0 ];
  //   //   newShoppingCart.products = [
  //   //     ...this.shoppingCart,
  //   //   ]

  //   //   console.log("makePayment / newShoppingCart:", newShoppingCart);
  //   //   newShoppingCart.products.forEach((product: any) => {
  //   //     product.quantity = 0;
  //   //     delete product.quantity
  //   //   })
  //   // })

  // }
}
