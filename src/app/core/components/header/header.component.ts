import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Subscription } from 'rxjs';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { AuthService } from '../../../auth/auth.service';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';
import { UsersService } from '../../../users/users.service';
import { Product, ShoppingCart } from '../../models/cart.model';
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
  styleUrls: [ './header.component.scss' ], // se corrige 'styleUrl' a 'styleUrls'
})
export class HeaderComponent implements OnInit, OnDestroy {

  // ==========================
  // Signals y propiedades
  // ==========================
  categories = signal<string[]>([]);
  isAuthenticated = false;
  items: MenuItem[] = [];
  formGroup!: FormGroup;
  user?: Users;
  initialsName = '';
  title = 'HEADER.LOGIN';
  isVisible = false;

  productsShoppingCart = 0;
  favoriteProducts = 0;
  cart?: ShoppingCart;

  private subscriptions = new Subscription();

  // ==========================
  // Constructor
  // ==========================
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private userService: UsersService
  ) { }

  // ==========================
  // Ciclo de vida
  // ==========================
  ngOnInit(): void {
    this.initializeComponent();
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    // Anula todas las suscripciones almacenadas
    this.subscriptions.unsubscribe();
    // Opcional, si no se están usando suscripciones directas a shoppingCart$ o favoriteProducts$
    // entonces no hace falta llamar a .unsubscribe() sobre estos Subjects
    // this.userService.shoppingCart$.unsubscribe();
    // this.userService.favoriteProducts$.unsubscribe();

    // Limpia otros estados si es necesario
    this.userService.selectedProduct.set({} as Product);
  }

  // ==========================
  // Métodos de Inicialización
  // ==========================
  private initializeComponent(): void {
    // Recupera carrito del LocalStorage (si existe) y notifica a shoppingCart$
    this.initializeLocalCart();
    // Verifica si existe sesión de usuario
    this.checkUserAuthentication();
    // Construye ítems de menú con el estado inicial
    this.buildMenuItems();
  }

  private initSubscriptions(): void {
    // Suscripción a cambios en la autenticación
    const authSub = this.authService.isAuthenticated$.subscribe(() => {
      this.checkUserAuthentication();
    });
    this.subscriptions.add(authSub);

    // Suscripción a cambios en el carrito
    const cartSub = this.userService.shoppingCart$.subscribe((cart) => {
      if (cart) {
        this.productsShoppingCart = cart.products?.length || 0;
        this.cart = cart;
      }
    });
    this.subscriptions.add(cartSub);
  }

  // ==========================
  // Métodos de Autenticación
  // ==========================
  /**
   * Verifica si el usuario está autenticado y obtiene datos asociados
   */
  private checkUserAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.resetUserState();
      return;
    }

    // El usuario está autenticado, recupera datos
    this.user = this.authService.getSessionStorage('user');
    this.isAuthenticated = true;

    this.setUserInitials();
    this.setUserRoleVisibility();
    this.title = 'HEADER.LOGOUT';

    // Carga información extra (carrito, favoritos, etc.)
    this.loadUserRelatedData();
  }

  /**
   * Establece las iniciales del usuario (firstname y lastname)
   */
  private setUserInitials(): void {
    if (!this.user?.name) return;
    const { firstname = '', lastname = '' } = this.user.name;
    this.initialsName =
      (firstname[ 0 ]?.toUpperCase() || '') + (lastname[ 0 ]?.toUpperCase() || '');
  }

  /**
   * Define si se muestra cierta parte del menú u opciones de admin
   */
  private setUserRoleVisibility(): void {
    this.isVisible = this.user?.role === 'admin';
  }

  /**
   * Reinicia el estado del usuario cuando no está autenticado
   */
  private resetUserState(): void {
    this.user = undefined;
    this.isAuthenticated = false;
    this.isVisible = false;
    this.initialsName = '';
    this.title = 'HEADER.LOGIN';
    this.productsShoppingCart = 0;
    this.favoriteProducts = 0;
    this.cart = undefined;
    // Reconstruye menú con estado no autenticado
    this.buildMenuItems();
  }

  /**
   * Lógica que maneja el click en el botón de Login/Logout
   */
  toggleAuthentication(event: Event): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([ '/auth/login' ]);
      return;
    }

    // Si está autenticado, mostrar confirmación de logout
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant(
        'LOGIN.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT'
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Al aceptar
        this.handleLogout();
      },
      reject: () => {
        // Al cancelar, no se hace nada
      },
    });
  }

  /**
   * Procesa el cierre de sesión
   */
  private handleLogout(): void {
    this.resetUserState();
    // Redirecciones deseadas
    this.redirectAfterLogout();
    // Lógica final de logout
    this.authService.logout();
  }

  /**
   * Reubica al usuario si estaba en ciertas rutas cuando hace logout
   */
  private redirectAfterLogout(): void {
    if (
      this.router.url === '/dashboard' ||
      this.router.url.includes('/carts/') ||
      this.router.url.includes('/checkout/')
    ) {
      this.router.navigate([ '/' ]);
    }
  }

  // ==========================
  // Métodos de Carga de Datos
  // ==========================
  /**
   * Verifica si existe un carrito en localStorage y lo inicializa en shoppingCart$
   */
  private initializeLocalCart(): void {
    const cartLocalStorage = this.authService.getLocalStorage('shoppingCart') || [];
    if (cartLocalStorage) {
      this.userService.shoppingCart$.next(cartLocalStorage);
    }
  }

  /**
   * Carga datos asociados al usuario autenticado
   */
  private loadUserRelatedData(): void {
    const userId = this.user?.userId;
    if (!userId) return;

    // Obtener carrito
    const localCart = this.authService.getLocalStorage('shoppingCart');
    if (localCart) {
      this.userService.shoppingCart$.next(localCart);
      this.subscriptions.add(localCart);
    } else {
      const cartSub = this.userService
        .getShoppingCartByUserId(userId)
        .subscribe((cart) => {
          if (cart) {
            this.productsShoppingCart = cart.products?.length || 0;
            this.cart = cart;
          }
        });
      this.subscriptions.add(cartSub);
    }

    // Obtener favoritos
    const favSub = this.userService
      .getFavoriteProductById(userId)
      .subscribe((favorites) => {
        this.favoriteProducts = favorites?.products?.length || 0;
      });
    this.subscriptions.add(favSub);
  }

  // ==========================
  // Métodos de Navegación
  // ==========================
  navigateToShoppingCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([ '/carts/id/0' ]);
      return;
    }
    // Si hay un carrito, ir a él
    const shoppingCart = this.userService.shoppingCart$.value;
    if (shoppingCart._id) {
      this.router.navigate([ `/carts/id/${shoppingCart._id}` ]);
      return;
    } else {
      this.router.navigate([ '/carts/id/0' ]);
      return;
    }
    
  }

  // ==========================
  // Construcción de Menú
  // ==========================
  private buildMenuItems(): void {
    this.items = [
      {
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
        // Podríamos agregarle route si se desea
      },
      {
        label: 'HEADER.DASHBOARD',
        icon: 'pi pi-shop',
        visible: this.isVisible,
        route: '/dashboard',
      },
    ];
  }
}
