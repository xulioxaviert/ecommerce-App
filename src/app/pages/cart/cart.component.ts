import { DecimalPipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
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
      console.log('getData / user:', user);

      this.usersService.getShoppingCartById(user.userId).pipe(
        switchMap((shoppingCart: any) => this.httpService.getAllProducts().pipe(
          map((products: any) => ({ shoppingCart: shoppingCart[ 0 ], products }))
        ))
      ).subscribe(({ shoppingCart, products }: any) => {
        console.log(".subscribe / shoppingCart, products:", shoppingCart, products);
        this.shoppingCartCalculation(shoppingCart, products);
      });

    } else {
      this.router.navigate([ '/login' ]);
    }
  }


  shoppingCartCalculation(shoppingCart: any, products: any) {
    console.log("shoppingCartCalculation / shoppingCart:", shoppingCart);
    console.log("shoppingCartCalculation / products:", products);
    shoppingCart.products.forEach((product: any) => {
      const productData = products.find((p: any) => p.productId === product.productId);
      console.log("shoppingCartCalculation / productData:", productData);
      let subTotal = 0;
      let totalProducts = 0;
      product.sizeQuantities.forEach((element: any) => {
        subTotal += productData.price * element.quantity;
        totalProducts += element.quantity;
      })

      this.shoppingCart.push({ ...productData, ...product, subTotal, totalProducts });
      this.subTotal += subTotal;
    })
    this.tax = this.subTotal * 0.21;
    this.total = this.subTotal + this.tax + this.shipping;

    console.log("shoppingCartCalculation / shoppingCart:", this.shoppingCart);
  }

  ngOnDestroy(): void { }
}
