import { Inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { Product, ShoppingCart } from '../models/cart.model';
import { Users } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private cart: ShoppingCart = {
    userId: null,
    date: new Date(),
    products: [],
    cartId: 0,
  };

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService,
    private confirmationService: ConfirmationService
  ) { }

  checkUserCartStatus() {
    const isAuthenticated = this.authService.isAuthenticated();
    const localCart: ShoppingCart = this.authService.getLocalStorage('shoppingCart');
    let DBCart: ShoppingCart[] = [];
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
        .subscribe((shoppingCarts: ShoppingCart[]) => {
          DBCart = shoppingCarts;
          console.log(".subscribe / shoppingCarts:", shoppingCarts);

          switch (isAuthenticated) {
            case localCart && Object.keys(localCart).length > 0:
              this.loggedUserHasCartLocalStorage(user)
              console.log(
                '⚠️ Usuario autenticado y tiene carrito en el LocalStorage.'
              );
              break;
            case DBCart && DBCart.length > 0:
              this.updateDBCart(DBCart[ 0 ], user.userId);
              console.log('✅ Usuario autenticado y tiene carrito en (BBDD).');
              break;

            case DBCart && DBCart.length === 0:
              this.createDBCart(cart, user.userId);
              console.log('⚠️ Usuario autenticado no tiene carrito (BBDD).');
              break;
            default:
              console.log('Estado del carrito no identificado.');
              break;
          }
        });
    } else {
      switch (!isAuthenticated) {
        case Object.keys(localCart).length > 0:
          console.log(
            '⚠️ Usuario no autenticado y tiene carrito en el localStorage.'
          );
          this.updateLocalStoreCart();
          break;
        case (!localCart || Object.keys(localCart).length === 0):
          console.log(
            '🚫 Usuario no autenticado y no tiene carrito en el localStorage.'
          );
          this.createLocalStoreCart(cart);
          break;
        default:
          console.log('Estado del carrito no identificado.');
          break;
      }
    }
  }

  createLocalStoreCart(cart: ShoppingCart): void {
    console.log('createLocalStoreCart / cart:', cart);
    this.authService.setLocalStorage('shoppingCart', JSON.stringify(cart));

    this.usersService.shoppingCart$.next(cart);
  }
  createDBCart(cart: ShoppingCart, userId: number): void {
    console.log('createLocalStoreCart / cart:', cart);
    const payload = {
      userId,
      date: new Date(),
      products: cart.products,
    }
    this.usersService.createShoppingCart(payload).subscribe((cart) => {
      this.usersService.shoppingCart$.next(cart);
    });
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

  }
  updateDBCart(cart: ShoppingCart, userId: number): void {
    console.log("updateDBCart / cart:", cart);
    const products = this.usersService.selectedProduct();

    cart.products = cart.products.filter(
      (product: Product) => product.id !== products.id
    );
    cart.products.push(products);
    const payload: ShoppingCart = {
      userId,
      date: new Date(),
      products: cart.products,
      cartId: 0
    }
    this.usersService.putShoppingCart(cart.id, payload).subscribe((updatedCart) => {
      this.usersService.shoppingCart$.next(updatedCart);
    });
    this.usersService.shoppingCart$.next(cart);
  }
  loggedUserHasCartLocalStorage(user: Users) {

    let cartLocalStorage = this.authService.getLocalStorage('shoppingCart');
    const products = this.usersService.selectedProduct();
    cartLocalStorage.products.push(products);

    cartLocalStorage.products = cartLocalStorage.products.filter(
      (product: Product) => product.id !== products.id
    );
    cartLocalStorage.products.push(products);

    this.confirmationService.confirm({
      target: document.body,
      message: 'Do you have products in your cart, do you want to unify them?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        cartLocalStorage = {
          ...cartLocalStorage,
          userId: user.userId,
        }
        this.usersService.createShoppingCart(cartLocalStorage).subscribe((cart) => {
          this.usersService.shoppingCart$.next(cart);
          this.authService.removeLocalStorage('shoppingCart')
        });
      },
      reject: () => { },
    });

  }
}
