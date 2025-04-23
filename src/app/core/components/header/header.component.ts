import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Subject, takeUntil } from 'rxjs';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { AuthService } from '../../../auth/auth.service';
import { APP_ROUTES } from '../../../shared/constants/app-routes.constant';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';
import { UsersService } from '../../../users/users.service';
import { Product, ShoppingCart } from '../../models/cart.model';
import { Users } from '../../models/user.model';

/**
 * Componente de cabecera principal de la aplicación
 * Gestiona la navegación, autenticación y estado del carrito
 */
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
  styleUrls: [ './header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush  // Estrategia de optimización del rendimiento
})
export class HeaderComponent implements OnInit, OnDestroy {
  // =====================================
  // Señales y Propiedades Reactivas
  // =====================================
  readonly isAuthenticated = signal(false);
  readonly user = signal<Users | undefined>(undefined);
  readonly productsShoppingCart = signal(0);
  readonly favoriteProducts = signal(0);
  readonly cart = signal<ShoppingCart | undefined>(undefined);
  readonly items = signal<MenuItem[]>([]);

  // Propiedades computadas para derivar datos del estado
  readonly initialsName = computed(() => this.getUserInitials());
  readonly title = computed(() => this.isAuthenticated() ? 'HEADER.LOGOUT' : 'HEADER.LOGIN');
  readonly isVisible = computed(() => this.user()?.role === 'admin');

  // Control de suscripciones
  private destroy$ = new Subject<void>();

  // =====================================
  // Constructor e Inyección de Dependencias
  // =====================================
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private userService: UsersService
  ) { }

  // =====================================
  // Hooks del Ciclo de Vida
  // =====================================
  ngOnInit(): void {
    this.initializeComponent();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    // Patrón de limpieza con Subject
    this.destroy$.next();
    this.destroy$.complete();

    // Limpieza adicional de estado
    this.userService.selectedProduct.set({} as Product);
  }

  // =====================================
  // Métodos de Inicialización
  // =====================================
  /**
   * Inicializa el componente cargando datos y estado inicial
   */
  private initializeComponent(): void {
    this.initializeLocalCart();
    this.checkUserAuthentication();
    this.buildMenu();
  }

  /**
   * Configura las suscripciones para reaccionar a cambios en el estado
   */
  private setupSubscriptions(): void {
    // Suscripción a cambios en la autenticación
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkUserAuthentication());

    // Suscripción a cambios en el carrito de compras
    this.userService.shoppingCart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        if (cart) {
          this.productsShoppingCart.set(cart.products?.length ?? 0);
          this.cart.set(cart);
        }
      });
  }

  // =====================================
  // Métodos de Autenticación y Usuario
  // =====================================
  /**
   * Actualiza el estado basado en la autenticación del usuario actual
   */
  private checkUserAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.resetUserState();
      return;
    }

    // Se obtiene el usuario desde el almacenamiento de sesión
    const sessionUser = this.authService.getSessionStorage('user');
    this.user.set(sessionUser);
    this.isAuthenticated.set(true);
    this.buildMenu(); // Actualiza el menú con el estado de autenticación actualizado

    // Se cargan datos relacionados con el usuario
    this.loadUserRelatedData();
  }

  /**
   * Restablece todas las señales y estado cuando el usuario no está autenticado
   */
  private resetUserState(): void {
    this.user.set(undefined);
    this.isAuthenticated.set(false);
    this.productsShoppingCart.set(0);
    this.favoriteProducts.set(0);
    this.cart.set(undefined);
    this.buildMenu();
  }

  /**
   * Maneja el inicio o cierre de sesión según estado actual
   */
  toggleAuthentication(event: Event): void {
    if (!this.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.AUTH.LOGIN]);
      return;
    }

    // Se muestra una confirmación para cerrar sesión
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('LOGIN.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.processLogout(),
    });
  }

  /**
   * Procesa el cierre de sesión
   */
  private processLogout(): void {
    this.redirectAfterLogout();
    this.authService.logout();
    this.resetUserState();
  }

  /**
   * Redirige al usuario a la página principal si está en una ruta restringida
   */
  private redirectAfterLogout(): void {
    const restrictedRoutes = [
      APP_ROUTES.DASHBOARD,
      APP_ROUTES.CART.BASE,
      APP_ROUTES.CHECKOUT
    ];

    const shouldRedirect = restrictedRoutes.some(route =>
      this.router.url === route || this.router.url.includes(route));

    if (shouldRedirect) {
      this.router.navigate([APP_ROUTES.HOME]);
    }
  }

  // =====================================
  // Métodos de Carga de Datos
  // =====================================
  /**
   * Inicializa el carrito desde localStorage si existe
   */
  private initializeLocalCart(): void {
    const localCart = this.authService.getLocalStorage('shoppingCart') as ShoppingCart;
    if (localCart) {
      this.userService.shoppingCart$.next(localCart);
    }
  }

  /**
   * Carga datos asociados al usuario autenticado
   */
  private loadUserRelatedData(): void {
    const userId = this.user()?.userId;
    if (!userId) return;

    // Actualiza carrito según usuario
    this.loadUserCart(userId.toString());

    // Carga productos favoritos
    this.userService.getFavoriteProductById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favoriteProducts.set(favorites?.products?.length ?? 0);
      });
  }

  /**
   * Carga el carrito del usuario autenticado
   */
  private loadUserCart(userId: string): void {
    const localCart = this.authService.getLocalStorage('shoppingCart') as ShoppingCart;

    if (localCart) {
      this.userService.shoppingCart$.next(localCart);
    } else {
      this.userService.getShoppingCartByUserId(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(cart => {
          if (cart) {
            this.userService.shoppingCart$.next(cart);
          }
        });
    }
  }

  // =====================================
  // Métodos de Navegación
  // =====================================
  /**
   * Navega al carrito de compras según estado de autenticación
   */
  navigateToShoppingCart(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.CART.DETAIL('0')]);
      return;
    }

    const shoppingCart = this.userService.shoppingCart$.value;
    const cartId = shoppingCart?._id || '0';

    this.router.navigate([APP_ROUTES.CART.DETAIL(cartId)]);
  }

  // =====================================
  // Construcción de Menú
  // =====================================
  /**
   * Construye los elementos del menú principal
   */
  private buildMenu(): void {
    // Se usa el valor actual de isVisible para construir el menú
    const adminVisible = this.isVisible();

    const menuItems: MenuItem[] = [
      {
        label: 'HEADER.HOME',
        icon: 'pi pi-home',
        visible: true,
        route: APP_ROUTES.HOME,
      },
      {
        label: 'HEADER.NEW_ARRIVALS',
        icon: 'pi pi-shop',
        visible: true,
        route: APP_ROUTES.CATEGORIES.FEATURE,
      },
      {
        label: 'HEADER.FEATURED',
        icon: 'pi pi-shop',
        visible: true,
        route: APP_ROUTES.FEATURED,
      },
      {
        label: 'HEADER.OUTLET',
        icon: 'pi pi-shop',
        visible: true,
        route: APP_ROUTES.CATEGORIES.OUTLET,
      },
      {
        label: 'HEADER.CATEGORY',
        icon: 'pi pi-shopping-bag',
        visible: true,
        route: APP_ROUTES.CATEGORIES.BASE,
        items: [
          {
            label: 'HEADER.MEN_CLOTHING',
            icon: 'pi pi-pencil',
            visible: true,
            route: APP_ROUTES.CATEGORIES.MEN,
          },
          {
            label: 'HEADER.WOMEN_CLOTHING',
            icon: 'pi pi-palette',
            visible: true,
            route: APP_ROUTES.CATEGORIES.WOMEN,
          },
          {
            label: 'HEADER.ELECTRONICS',
            icon: 'pi pi-bolt',
            visible: true,
            route: APP_ROUTES.CATEGORIES.ELECTRONICS,
          },
          {
            label: 'HEADER.JEWELRY',
            icon: 'pi pi-server',
            visible: true,
            route: APP_ROUTES.CATEGORIES.JEWELRY,
          },
        ],
      },
      {
        label: 'HEADER.FAVORITES',
        icon: 'pi pi-shop',
        visible: true,
        route: APP_ROUTES.FAVORITES,
      },
      {
        label: 'HEADER.DASHBOARD',
        icon: 'pi pi-shop',
        visible: adminVisible,
        route: APP_ROUTES.DASHBOARD,
      },
    ];

    this.items.set(menuItems);
  }

  // =====================================
  // Métodos de Utilidad
  // =====================================
  /**
   * Obtiene las iniciales del usuario para mostrar en el avatar
   */
  private getUserInitials(): string {
    const { firstname = '', lastname = '' } = this.user()?.name || {};
    return `${firstname[0]?.toUpperCase() ?? ''}${lastname[0]?.toUpperCase() ?? ''}`;
  }
}
