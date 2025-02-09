import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Product, ShoppingCart } from '../../core/models/cart.model';
import { Users } from '../../core/models/user.model';
import { UsersService } from '../../users/users.service';
import { ModalService } from './product-modal-service.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ DialogModule, UpperCasePipe, ButtonModule ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModal implements OnInit, OnDestroy {
  @Input() currentProduct: Product;
  visible: boolean = false;
  quantitySize: number = 0;
  totalProduct: number = 5;
  user: Users;
  shoppingCart: ShoppingCart = {
    id: '0',
    userId: null,
    date: new Date(),
    products: [],
    cartId: 0,
  };
  subscription: Subscription;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.shoppingCart = this.createEmptyCart(this.authService.isAuthenticated() ? this.authService.getSessionStorage('user').userId : null);
  }

  ngOnInit(): void {
    this.getData();
    this.getSubscriptions();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    this.modalService.openModal$.subscribe((product) => {
      if (product && product.properties && product.properties.length > 0) {
        this.currentProduct = product;
        this.visible = true;
      }
    });

  }

  private createEmptyCart(userId: number | null): ShoppingCart {
    return {
      id: '0',
      userId: userId,
      date: new Date(),
      products: [],
      cartId: 0,
    };
  }



  getSubscriptions() {
    this.subscription = this.modalService.openModal$.subscribe((product) => {
      if (product && product.properties && product.properties.length > 0) {
        this.currentProduct = product;
      }
    });
    this.subscription.add(
      this.usersService.shoppingCart$.subscribe((shoppingCart: any) => {
        console.log('this.subscription.add / shoppingCart:', shoppingCart);
        this.shoppingCart = shoppingCart;
      })
    );
    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        console.log('this.subscription.add / user:', user);
        this.user = user;
      })
    );
  }
  addProductToNewCart() {
    // const productExists =
    //   this.shoppingCart?.products?.some(
    //     (product) => product.id === this.currentProduct.id
    //   ) || false;

    // const updatedProducts = productExists
    //   ? this.shoppingCart.products
    //   : [ ...(this.shoppingCart?.products || []), this.currentProduct ];

    // this.shoppingCart.products.forEach((product) => {
    //   if (product.type === 'composite') {
    //     product.properties.forEach((property) => {
    //       property.size.forEach((s: any) => {
    //         if (s.size === this.currentProduct.properties[ 0 ].size) {
    //           s.quantity += 1;
    //           product.quantity += 1;
    //         }
    //         return s;
    //       });
    //     });
    //   } else if (product.type === 'simple') {
    //     product.quantity += 1;
    //   }
    // });

    // this.totalProduct = this.shoppingCart.products.reduce(
    //   (total: number, product: any) =>
    //     (total += product.quantity * product.price),
    //   0
    // );

    // const payload: any = {
    //   id: this.shoppingCart?.id || '0',
    //   userId: this.authService.isAuthenticated() ? this.user.userId : null,
    //   date: new Date(),
    //   products: updatedProducts,
    //   quantity: this.totalProduct,
    // };

    // console.log('payload', payload);

    // this.shoppingCart = payload;
    // this.visible = false;
    // this.usersService.shoppingCart$.next(payload);
  }
  decrementQuantity(currentProduct: Product, size: any): void {
    console.log('decrementQuantity / currentProduct:', currentProduct, size);

  }
  incrementQuantity(currentProduct: Product, size: any) {
    console.log('incrementQuantity / id:', currentProduct, size);
  }
}
