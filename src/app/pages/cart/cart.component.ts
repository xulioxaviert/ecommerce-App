import { DecimalPipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Products } from '../../core/models/products.model';
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
  shoppingCart: any[] = [];
  total: number = 0;
  shipping: number = 4;
  tax: number = 0;
  subTotal: number = 0;
  cartProductTotal: number = 0;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getSessionStorage('user');
      this.usersService
        .getShoppingCartByUserId(user.userId)
        .pipe(
          tap(console.log),
          switchMap((shoppingCart: any) =>
            this.httpService.getAllProducts().pipe(
              map((products: any) => ({
                shoppingCart: shoppingCart[ 0 ],
                products,
              }))
            )
          )
        )
        .subscribe(({ shoppingCart, products }: any) => {
          this.shoppingCartCalculation(shoppingCart, products);

        });
    } else {
      this.router.navigate([ '/login' ]);
    }
  }

  shoppingCartCalculation(shoppingCart: any, products: any) {

    shoppingCart.products.forEach((product: any) => {
      const productData = products.find(
        (p: any) => p.productId === product.productId
      );
      let subTotal = 0;
      let cartProductTotal = 0;
      product.size.forEach((element: any) => {
        subTotal += productData.price * element.quantity;
        cartProductTotal += element.quantity;
      });

      this.shoppingCart.push({
        ...productData,
        ...product,
        subTotal,
        cartProductTotal,
      });
      this.subTotal += subTotal;
    });

    this.tax = this.subTotal * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }

  addProduct(product: any): void {

  }



  navigateToProductDetail(product: Products) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }
  ngOnDestroy(): void { }

  decrementQuantity(cart: any, size: any): void {
    console.log('decrementQuantity', cart, size);
    this.shoppingCart = this.shoppingCart.map(product => {
      if (product.productId === cart.productId) {
        product.size = product.size.map((s: any) => {
          if (s.size === size.size) {
            if (s.quantity <= 0) return s;
            s.quantity -= 1;
            product.subTotal -= product.price;
          }
          return s;
        });
        product.cartProductTotal = product.size.reduce((total: number, s: any) => total += s.quantity, 0);

      }
      return product;
    });
    this.subTotal = this.shoppingCart.reduce((total: number, product: any) => total += product.subTotal, 0);
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }

  incrementQuantity(productId: number, size: any): void {
    console.log('incrementQuantity', productId, size);
    this.shoppingCart = this.shoppingCart.map(product => {
      if (product.productId === productId) {
        product.size = product.size.map((s: any) => {
          if (s.size === size.size) {
            s.quantity += 1;
            product.subTotal += product.price;
          }
          return s;
        });
        product.cartProductTotal = product.size.reduce((total: number, s: any) => total += s.quantity, 0);
      }
      return product;
    });
    this.subTotal = this.shoppingCart.reduce((total: number, product: any) => total += product.subTotal, 0);
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;
  }
}


