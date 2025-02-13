import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Subscription, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Product, ShoppingCart } from '../../core/models/cart.model';
import { Users } from '../../core/models/user.model';
import { UsersService } from '../../users/users.service';
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

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private usersService: UsersService,
    private confirmationService: ConfirmationService

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
      if (product && product.properties && product.properties.length > 0) {
        this.currentProduct = product;
        this.visible = true;
      }
    });
  }

  getSubscriptions() {
    this.subscription = this.modalService.openModal$.subscribe((product) => {
      if (product && product.properties && product.properties.length > 0) {
        this.currentProduct = product;
      }
    });
  }
  addProductToNewCart() {
    this.usersService.selectedProduct.set(this.currentProduct);
    this.checkUserCartStatus();
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
        if (property.quantity <= 0) return;
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

  checkUserCartStatus(): number {
    const isAuthenticated = this.authService.isAuthenticated();
    const localCart = this.authService.getLocalStorage('shoppingCart');
    let DBCart: any = [];
    const cart: ShoppingCart = {

      userId: null,
      date: new Date(),
      products: [],
      cartId: 0,
    };
    const products = this.usersService.selectedProduct();
    console.log('checkUserCartStatus / products:', products);

    cart.products.push(products);

    if (isAuthenticated) {
      const user = this.authService.getSessionStorage('user');
      this.usersService
        .getShoppingCartByUserId(user.userId)
        .pipe(tap((cart) => (this.cart = cart)))
        .subscribe((shoppingCarts: ShoppingCart[]) => {
          DBCart = shoppingCarts;

          switch (true) {
            case isAuthenticated && Object.keys(this.cart).length > 0:
              console.log('✅ Usuario autenticado y tiene carrito en (BBDD).');
              return 1;
            case isAuthenticated && Object.keys(localCart).length > 0:
              this.loggedUserHasCartLocalStorage(user)
              console.log(
                '⚠️ Usuario autenticado y tiene carrito en el LocalStorage.'
              );
              return 5;
            case isAuthenticated && Object.keys(this.cart).length === 0:
              console.log('⚠️ Usuario autenticado no tiene carrito (BBDD).');
              return 2;
            default:
              console.log('Estado del carrito no identificado.');
              return 0;
          }
        });
    } else {
      switch (true) {
        case !isAuthenticated && Object.keys(localCart).length > 0:
          console.log(
            '⚠️ Usuario no autenticado y tiene carrito en el localStorage.'
          );
          this.updateLocalStoreCart();
          return 3;
        case !isAuthenticated &&
          (!localCart || Object.keys(localCart).length === 0):
          console.log(
            '🚫 Usuario no autenticado y no tiene carrito en el localStorage.'
          );
          this.createLocalStoreCart(cart);
          return 4;
        default:
          console.log('Estado del carrito no identificado.');
          return 0;
      }
    }
    return 0;
  }

  createLocalStoreCart(cart: ShoppingCart): void {
    console.log('createLocalStoreCart / cart:', cart);
    this.authService.setLocalStorage('shoppingCart', JSON.stringify(cart));
    this.visible = false;
    this.usersService.shoppingCart$.next(cart);
  }
  updateLocalStoreCart(): void {
    const cart = this.authService.getLocalStorage('shoppingCart');
    const products = this.usersService.selectedProduct();
    cart.products.push(products);

    cart.products = cart.products.filter(
      (product: Product) => product.id !== products.id
    );
    cart.products.push(products);
    this.authService.setLocalStorage('shoppingCart', JSON.stringify(cart));
    this.usersService.shoppingCart$.next(cart);
    this.visible = false;
  }
  loggedUserHasCartLocalStorage(user: Users) {

    let cartLocalStorage = this.authService.getLocalStorage('shoppingCart');
    cartLocalStorage.products.push(this.usersService.selectedProduct());

    this.confirmationService.confirm({
      target: document.body,
      message: 'Do you want to save the products in the shopping cart?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        cartLocalStorage = {
          ...cartLocalStorage,
          userId: user.userId,
        }
        this.authService.removeLocalStorage('shoppingCart')
        this.usersService.createShoppingCart(cartLocalStorage).subscribe((cart) => {
          this.usersService.shoppingCart$.next(cart);
        });
      },
      reject: () => { },
    });

  }

}
