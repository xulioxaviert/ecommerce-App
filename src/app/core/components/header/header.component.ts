import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  computed
} from '@angular/core';
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
  styleUrls: [ './header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush  // Estrategia de optimización del rendimiento
})
export class HeaderComponent implements OnInit, OnDestroy {
  // =====================================
  // Sección de Señales y Propiedades
  // =====================================
  categories = signal<string[]>([]);
  isAuthenticated = signal(false);
  items: MenuItem[] = [];
  formGroup!: FormGroup;
  user = signal<Users | undefined>(undefined);
  productsShoppingCart = signal(0);
  favoriteProducts = signal(0);
  cart = signal<ShoppingCart | undefined>(undefined);

  // Propiedades computadas para derivar datos del estado
  initialsName = computed(() => this.obtenerInicialesUsuario());
  title = computed(() => this.isAuthenticated() ? 'HEADER.LOGOUT' : 'HEADER.LOGIN');
  isVisible = computed(() => this.user()?.role === 'admin');

  private subscriptions = new Subscription();

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
    this.inicializarComponente();
    this.inicializarSubscripciones();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.userService.selectedProduct.set({} as Product);
  }

  // =====================================
  // Métodos de Inicialización
  // =====================================
  private inicializarComponente(): void {
    // Se inicializan el carrito local, la autenticación y el menú
    this.inicializarCarritoLocal();
    this.verificarAutenticacionUsuario();
    this.construirMenu();
  }

  private inicializarSubscripciones(): void {
    // Se suscribe a los cambios en la autenticación
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe((isAuth) => {
        this.isAuthenticated.set(isAuth);
        this.verificarAutenticacionUsuario();
      })
    );

    // Se suscribe a los cambios en el carrito de compras
    this.subscriptions.add(
      this.userService.shoppingCart$.subscribe((cart) => {
        if (cart) {
          this.productsShoppingCart.set(cart.products?.length ?? 0);
          this.cart.set(cart);
        }
      })
    );
  }

  // =====================================
  // Métodos de Autenticación y Gestión de Usuario
  // =====================================
  private verificarAutenticacionUsuario(): void {
    if (!this.authService.isAuthenticated()) {
      this.restablecerEstadoUsuario();
      return;
    }

    // Se obtiene el usuario desde el almacenamiento de sesión
    const usuarioSesion = this.authService.getSessionStorage<Users>('user');
    this.user.set(usuarioSesion);

    // Si el usuario tiene un identificador, se obtiene su carrito de compras
    if (usuarioSesion?.userId) {
      this.userService.getShoppingCartByUserId(usuarioSesion.userId).subscribe((cart) => {
        if (cart) {
          this.userService.shoppingCart$.next(cart);
        }
      });
    }

    // Se cargan otros datos relacionados (carrito, productos favoritos, etc.)
    this.cargarDatosRelacionadosUsuario();
  }

  private restablecerEstadoUsuario(): void {
    // Se reinician las señales y se reconstruye el menú con el estado de usuario no autenticado
    this.user.set(undefined);
    this.isAuthenticated.set(false);
    this.productsShoppingCart.set(0);
    this.favoriteProducts.set(0);
    this.cart.set(undefined);
    this.construirMenu();
  }

  toggleAuthentication(event: Event): void {
    if (!this.isAuthenticated()) {
      this.router.navigate([ '/auth/login' ]);
      return;
    }

    // Se muestra una confirmación para cerrar sesión en caso de estar autenticado
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('LOGIN.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.procesarLogout(),
    });
  }

  private procesarLogout(): void {
    this.restablecerEstadoUsuario();
    this.authService.logout();
    this.redirigirDespuesDeLogout();
  }

  private redirigirDespuesDeLogout(): void {
    const rutasRestringidas = [ '/dashboard', '/carts/', '/checkout/' ];
    if (rutasRestringidas.some((ruta) => this.router.url.includes(ruta))) {
      this.router.navigate([ '/' ]);
    }
  }

  // =====================================
  // Métodos de Carga y Sincronización de Datos
  // =====================================
  private inicializarCarritoLocal(): void {
    const carritoLocal = this.authService.getLocalStorage<ShoppingCart>('shoppingCart');
    if (carritoLocal) {
      this.userService.shoppingCart$.next(carritoLocal);
    }
  }

  private cargarDatosRelacionadosUsuario(): void {
    const userId = this.user()?.userId;
    if (!userId) return;

    // Actualización del carrito de compras
    this.subscriptions.add(
      this.userService.getShoppingCartByUserId(userId).subscribe((cart) => {
        if (cart) {
          this.productsShoppingCart.set(cart.products?.length ?? 0);
          this.cart.set(cart);
        }
      })
    );

    // Actualización de productos favoritos
    this.subscriptions.add(
      this.userService.getFavoriteProductById(userId).subscribe((favorites) => {
        this.favoriteProducts.set(favorites?.products?.length ?? 0);
      })
    );
  }

  // =====================================
  // Métodos de Navegación y Construcción del Menú
  // =====================================
  private construirMenu(): void {
    // Se construye el menú de navegación con base en la autenticación y roles del usuario
    this.items = [
      { label: 'HEADER.HOME', icon: 'pi pi-home', route: '/' },
      { label: 'HEADER.NEW_ARRIVALS', icon: 'pi pi-shop', route: '/categories/feature' },
      { label: 'HEADER.FEATURED', icon: 'pi pi-shop', route: '/category/featured' },
      { label: 'HEADER.OUTLET', icon: 'pi pi-shop', route: '/categories/outlet' },
      {
        label: 'HEADER.CATEGORY',
        icon: 'pi pi-shopping-bag',
        items: [
          { label: 'HEADER.MEN_CLOTHING', icon: 'pi pi-pencil', route: '/categories/men' },
          { label: 'HEADER.WOMEN_CLOTHING', icon: 'pi pi-palette', route: '/categories/women' },
          { label: 'HEADER.ELECTRONICS', icon: 'pi pi-bolt', route: '/categories/electronics' },
          { label: 'HEADER.JEWELRY', icon: 'pi pi-server', route: '/categories/jewelry' },
        ],
      },
      { label: 'HEADER.FAVORITES', icon: 'pi pi-shop' },
      { label: 'HEADER.DASHBOARD', icon: 'pi pi-shop', visible: this.isVisible(), route: '/dashboard' },
    ];
  }

  // =====================================
  // Métodos de Utilidad
  // =====================================
  private obtenerInicialesUsuario(): string {
    const { firstname = '', lastname = '' } = this.user()?.name || {};
    return `${firstname[ 0 ]?.toUpperCase() ?? ''}${lastname[ 0 ]?.toUpperCase() ?? ''}`;
  }
}
