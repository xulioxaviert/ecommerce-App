import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Product, ShoppingCart } from '../../../core/models/cart.model';

import { Users } from '../../../core/models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-products-detail',
  standalone: true,
  imports: [ UpperCasePipe, NgIf, NgFor, NgClass ],
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.scss',
})
export class ProductsDetailComponent implements OnInit {
  productDetail: Product;
  selectedSizes: any[] = [];
  hasShoppingCart: boolean = false;
  user: Users;
  cart: ShoppingCart[] = [];
  totalProduct: number = 0;


  quantity: number = 1;
  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.route.params.subscribe((params) => {
      this.getProductDetail(params[ 'id' ]);
    });
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getSessionStorage('user')
      this.usersService.getShoppingCartByUserId(user.userId).subscribe((cart) => {
        this.cart = cart;
        console.log('this.usersService.getShoppingCartById / this.cart:', this.cart);
      });
    }
  }
  getProductDetail(id: string): void {
    this.http.getProductsById(id).subscribe((product) => {
      this.productDetail = product;
      console.log(
        'this.http.getProductsById / this.productDetail:',
        this.productDetail
      );
    });
  }
  decrementQuantity(currentProduct: Product, size?: any): void {
    console.log('decrementQuantity / currentProduct:', currentProduct);
    if (currentProduct.type === 'composite') {
      currentProduct.properties.forEach((property) => {
        property?.size?.forEach((s: any) => {
          if (s.quantity <= 0) return;
          if (s.size === size.size) {
            s.quantity -= 1;
            property.quantity -= 1;
          }
        });
      });

      this.totalProduct = currentProduct.properties.reduce(
        (total, property) => {
          return (
            total +
            (property?.size
              ? property.size.reduce(
                (sizeTotal, s) => sizeTotal + s.quantity,
                0
              )
              : 0)
          );
        },
        0
      );
      this.usersService.selectedProduct.set(currentProduct);
    } else {
      currentProduct.properties.forEach((property) => {
        if (property.quantity <= 0) return;
        property.quantity -= 1;
      });
      this.totalProduct = currentProduct.properties.reduce(
        (total, property) => {
          return total + property.quantity;
        },
        0
      );
      this.usersService.selectedProduct.set(currentProduct);
    }
  }
  incrementQuantity(currentProduct: Product, size?: any) {
    if (currentProduct.type === 'composite') {
      currentProduct.properties.forEach((property) => {
        property?.size?.forEach((s: any) => {
          if (s.size === size.size) {
            s.quantity += 1;
            property.quantity += 1;
          }
        });
      });

      this.totalProduct = currentProduct.properties.reduce(
        (total, property) => {
          return (
            total +
            (property?.size
              ? property.size.reduce(
                (sizeTotal, s) => sizeTotal + s.quantity,
                0
              )
              : 0)
          );
        },
        0
      );
      this.usersService.selectedProduct.set(currentProduct);
    } else {
      currentProduct.properties.forEach((property) => {
       
        property.quantity += 1;
      });
      this.totalProduct = currentProduct.properties.reduce(
        (total, property) => {
          return total + property.quantity;
        },
        0
      );
      this.usersService.selectedProduct.set(currentProduct);
    }
  }
  addToCart(): void {

    // this.size = [];
    // this.selectedSizes.forEach((item) => {
    //   this.size.push({ size: item, quantity: this.quantity });
    // })

    // console.log('addToCart / size:', this.size);

    // const data = {
    //   ...this.productDetail,
    //   size: this.size,
    // }
    // console.log("addToCart / data:", data);



    // this.usersService.createShoppingCart(data).subscribe({
    //   next: (cart) => {
    //     console.log('Cart created successfully:', cart);
    //   },
    //   error: (err) => {
    //     console.error('Error creating cart:', err);
    //   }
    // });
    // console.log("addToCart / data:", data);

    // console.log('addToCart / selectedSizes:', this.selectedSizes);
    // console.log('addToCart / quantity:', this.quantity);
    // } else {
    //   console.log('Please login to add to cart');
    // }
  }
}
