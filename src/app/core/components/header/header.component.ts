import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
// Removed duplicate and incorrect import
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';
import { UsersService } from '../../../users/users.service';
import { ShoppingCart } from '../../models/cart.model';
import { Users } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    TranslationDropdownComponent,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgClass,
    NgIf,
    ConfirmPopupModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories = signal<string[]>([]);
  isAuthenticated: boolean = false;

  items: MenuItem[] | undefined;

  formGroup!: FormGroup;
  user: Users | undefined;
  initialsName: string = '';
  title = 'HEADER.LOGIN';
  isVisible: boolean = false;
  subscription = new Subscription();
  productsShoppingCart: number = 0;
  favoriteProducts: number = 0;
  cart: ShoppingCart | undefined;


  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.updateItemLanguage();
    this.checkAuthenticated();
    this.getSubscriptions();
  }

  checkAuthenticated() {
    const cartLocalStorage = this.authService.getLocalStorage('shoppingCart') || undefined;
    if (cartLocalStorage) { this.userService.shoppingCart$.next(cartLocalStorage) }
    if (!this.authService.isAuthenticated()) return;

    this.user = this.authService.getSessionStorage('user');
    const { firstname, lastname } = this.user?.name || {
      firstname: '',
      lastname: '',
    };

    this.initialsName =
      (firstname[ 0 ].toUpperCase() || '') + (lastname[ 0 ].toUpperCase() || '');

    this.isAuthenticated = true;
    this.isVisible = this.user?.role === 'admin' ? true : false;
    this.title = 'HEADER.LOGOUT';


    this.updateItemLanguage();
    this.getData();

  }

  getSubscriptions() {
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe((response) => {
        this.checkAuthenticated();
      })
    );

    this.subscription.add(
      this.userService.shoppingCart$.subscribe((cart: any) => {
        console.log('getSubscriptions', cart);
        if (cart) {
          this.productsShoppingCart = cart.products?.length || 0;
          this.cart = cart;
        }
      })
    );
  }

  updateItemLanguage() {

    this.items = [
      {
        //TODO revisar traducciones
        //TODO Revisar el ícono para la función click
        //TODO Tooltip para el title del ícono
        label: 'HEADER.HOME',
        icon: 'pi pi-home',
        visible: true,
        route: '/',
      },
      {
        label: 'HEADER.NEW_ARRIVALS',
        icon: 'pi pi-shop',
        visible: true,
        route: '/categories/feature',
      },
      {
        label: 'HEADER.FEATURED',
        icon: 'pi pi-shop',
        visible: true,
        route: '/category/featured',
      },
      {
        label: 'HEADER.OUTLET',
        icon: 'pi pi-shop',
        visible: true,
        route: '/categories/outlet',
      },
      {
        label: 'HEADER.CATEGORY',
        icon: 'pi pi-shopping-bag',
        visible: true,
        route: '/categories',
        items: [
          {
            label: 'HEADER.MEN_CLOTHING',
            icon: 'pi pi-pencil',
            visible: true,
            route: '/categories/men',
          },
          {
            label: 'HEADER.WOMEN_CLOTHING',
            icon: 'pi pi-palette',
            visible: true,
            route: '/categories/women',
          },
          {
            label: 'HEADER.ELECTRONICS',
            icon: 'pi pi-bolt',
            visible: true,
            route: '/categories/electronics',
          },
          {
            label: 'HEADER.JEWELRY',
            icon: 'pi pi-server',
            visible: true,
            route: '/categories/jewelry',
          },
        ],
      },
      {
        label: 'HEADER.FAVORITES',
        icon: 'pi pi-shop',
        visible: true,
      },
      {
        label: 'HEADER.DASHBOARD',
        icon: 'pi pi-shop',
        visible: this.isVisible,
        route: '/dashboard',
      },
    ];
  }

  toggleAuthentication(event: Event) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([ '/auth/login' ]);
    } else {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: this.translateService.instant('LOGIN.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.initialsName = '';
          this.isVisible = false;
          this.isAuthenticated = false;
          this.productsShoppingCart = 0;
          this.favoriteProducts = 0;
          this.title = 'HEADER.LOGIN';
          if (this.router.url === '/dashboard') {
            this.router.navigate([ '/' ]);
          } else if (this.router.url.includes('/carts/')) {
            this.router.navigate([ '/' ]);
          }
          else if (this.router.url.includes('/checkout/')) {
            this.router.navigate([ '/' ]);
          }
          this.updateItemLanguage();
          this.authService.logout();
        },
        reject: () => { },
      });
    }
  }

  navigateToShoppingCart() {
    //TODO revisar flujo del carrito de compras y guardar en local storage cuando no está logeado
    if (this.authService.isAuthenticated()) {
      this.router.navigate([ `/carts/${this.cart?.id}` ]);
    } else {
      this.router.navigate([ '/carts/0' ]);
    }
  }

  getData() {
    const userId = this.user?.userId;
    if (userId) {
      this.userService.getShoppingCartByUserId(userId).subscribe((cart: any) => {
        console.log('getData / cart:', cart);
        if (cart.length > 0) {
          this.productsShoppingCart = cart[ 0 ].products?.length || 0;
          this.cart = cart[ 0 ];
        }
      });
      this.userService
        .getFavoriteProductById(userId)
        .subscribe((favorites: any) => {
          console.log(
            'this.userService.getFavoriteProductById / favorites:',
            favorites
          );
          this.favoriteProducts = favorites[ 0 ]?.products?.length || 0;
        });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userService.shoppingCart$.unsubscribe()
    this.userService.favoriteProducts$.unsubscribe()


  }
}
