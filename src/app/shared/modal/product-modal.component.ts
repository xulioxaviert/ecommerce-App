import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Product, ShoppingCart, Stock } from '../../core/models/cart.model';
import { Users } from '../../core/models/user.model';
import { UsersService } from '../../users/users.service';
import { ShoppingCartService } from './../../core/services/shopping-cart.service';
import { ModalService } from './product-modal-service.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ DialogModule, UpperCasePipe, ButtonModule, NgIf, NgFor ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModal implements OnInit, OnDestroy {
  @Input() currentProduct: Product;
  visible: boolean = false;
  quantityProduct: number = 1;
  totalProduct: number = 0;
  user: Users;
  shoppingCart: ShoppingCart = {
    userId: null,
    date: new Date(),
    products: [],
    cartId: 0,
  };
  subscription: Subscription;
  cart: any;
  stock: Stock[] = [];

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getSubscriptions();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    this.modalService.openModal$.subscribe((product) => {
      this.usersService.selectedProduct.set(product);
      this.visible = true;
    });
  };



  getSubscriptions() {
    this.subscription = this.modalService.openModal$.subscribe((product) => {
      if (product && product.properties && product.properties.length > 0) {
        this.currentProduct = product;
      }
    });
  }
  addProductToNewCart() {
    this.usersService.selectedProduct.set(this.currentProduct);
    //this.checkUserCartStatus();
    this.shoppingCartService.checkUserCartStatus();
    this.visible = false;
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


}
