import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { ENDPOINTS } from '../../../core/const/constants';
import { Product, ShoppingCart } from '../../../core/models/cart.model';
import { Users } from '../../../core/models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../shared/modal/product-modal-service.service';
import { ProductModal } from '../../../shared/modal/product-modal.component';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-mens',
  standalone: true,
  imports: [ CommonModule, NgForOf, TranslateModule, ProductModal, NgIf ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.scss',
  providers: [],
})
export class MenComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  currentProduct: Product = {} as Product;
  visible: boolean = false;
  subscription: Subscription = new Subscription();
  user: Users = {} as Users;
  shoppingCart: ShoppingCart = {} as ShoppingCart;

  constructor(
    private http: HttpService,
    private router: Router,
    private modalService: ModalService,
    private authService: AuthService,
    private usersService: UsersService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getData();
    // this.getSubscriptions();
    // this.checkAuthenticationAndCart();
    this.getSubscriptions();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "men's clothing")
        .forEach((product: Product) => this.products.push(product));
      console.log('products', this.products);
    });

    this.authService.isAuthenticated$ ? this.user = this.authService.getSessionStorage('user') : null;
  }

  getSubscriptions() {
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        console.log('this.subscription.add / isAuthenticated:', isAuthenticated);
        this.checkAuthenticationAndCart()
      })
    );
    this.subscription.add(
      this.usersService.shoppingCart$.subscribe((shoppingCart) => {
        console.log(
          'this.subscription.add / shoppingCart:', shoppingCart
        );
        this.shoppingCart = shoppingCart
        if (shoppingCart) {
          this.checkAuthenticationAndCart();
        }
      })
    );
  }

  navigateToProductDetail(product: Product) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ]);
  }
  openModalSize(product: Product) {
    this.visible = true;
    this.modalService.openModal(product);
  }

  checkAuthenticationAndCart() {
    if (this.authService.isAuthenticated()) {
      // Usuario está autenticado
      if (this.shoppingCart?.products?.length > 0) {
        if (this.shoppingCart.userId === null) {
          this.shoppingCart.userId = this.user.userId;
        }
        const payload = {
          userId: this.user.userId,
          date: new Date(),
          products: [ ...this.shoppingCart.products ],
        }
        console.log('✅ Usuario autenticado y tiene productos en el carrito (WEB).');

      } else {
        console.log('⚠️ Usuario autenticado pero su carrito está vacío (WEB).');
      }
      // Verificar si tiene carrito en la base de datos
      this.usersService.getShoppingCartByUserId(this.user.userId).subscribe((cart) => {
        console.log("this.usersService.getShoppingCartByUserId / cart:", cart);
        if (cart.length > 0) {
          console.log('✅ Usuario autenticado y tiene carrito en la base de datos.');
          this.usersService.putShoppingCart(cart[ 0 ].id, this.shoppingCart).subscribe((cart) => {
            console.log('this.usersService.putShoppingCart / cart:', cart);

          })

        } else {
          console.log('⚠️ Usuario autenticado pero no tiene carrito en la base de datos.');
          this.confirmationService.confirm({
            // target: event.target as EventTarget,
            message: 'Tienes productos en el carrito, ¿Deseas unificarlos?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.groupShoppingCar()
            },
            reject: () => { },
          });
        }
      });
      //Verificar si tiene carrito en el localStorage
      const localCart = this.authService.getLocalStorage('shoppingCart')
      if (localCart && localCart.products?.length > 0) {
        console.log('✅ Usuario autenticado y tiene carrito en el localStorage.');
        const shoppingCart = this.authService.getLocalStorage('shoppingCart');
        const payload = {
          userId: this.user.userId,
          date: new Date(),
          products: [ ...shoppingCart.products ],
        }
        this.authService.setLocalStorage('shoppingCart', JSON.stringify(payload));
      } else {
        console.log('⚠️ Usuario autenticado pero no tiene carrito en el localStorage.');
      }
    } else {
      // Usuario no autenticado
      if (this.shoppingCart?.products?.length > 0) {
        console.log('🔒 Usuario no autenticado y tiene productos en el carrito de (WEB).');
        const payload = {
          userId: null,
          date: new Date(),
          products: [ ...this.shoppingCart.products ],
        }
        this.authService.setLocalStorage('shoppingCart', JSON.stringify(payload));
      } else {
        console.log('🚫 Usuario no autenticado y no tiene productos en el carrito (WEB).');
      }
      //Verificar si tiene carrito en el localStorage
      const localCart = this.authService.getLocalStorage('shoppingCart')
      if (localCart && localCart.products?.length > 0) {
        console.log('🚫 Usuario no autenticado y tiene carrito en el localStorage.');
      } else {
        console.log('🚫 Usuario no autenticado y no tiene carrito en el localStorage.');
      }
    }

  }
  groupShoppingCar() {
    const localCart = this.authService.getLocalStorage('shoppingCart');
    this.usersService.createShoppingCart(localCart).subscribe((cart) => {
      console.log('this.usersService.createShoppingCart / cart:', cart);
      this.usersService.shoppingCart$.next(cart);
      this.authService.removeLocalStorage('shoppingCart');
    })
  }

  

}
