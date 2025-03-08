import { DecimalPipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Product, ShoppingCart } from '../../core/models/cart.model';
import { Users } from '../../core/models/user.model';
import { ShoppingCartService } from '../../core/services/shopping-cart.service';
import { UsersService } from '../../users/users.service';
import { CartListComponent } from "./cart-list/cart-list.component";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";

/**
 * Componente encargado de gestionar la página del carrito de compras.
 * Se encarga de mostrar los productos en el carrito y realizar operaciones sobre ellos.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ NgFor, DecimalPipe, UpperCasePipe, CartListComponent, OrderSummaryComponent ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  /** Objeto que contiene la información del carrito de compras */
  shoppingCart: ShoppingCart = {} as ShoppingCart;
  /** Total a pagar (subtotal + impuestos + envío) */
  total: number = 0;
  /** Costo de envío fijo */
  shipping: number = 4;
  /** Impuestos calculados sobre el subtotal y envío */
  tax: number = 0;
  /** Suma del precio de todos los productos */
  subTotal: number = 0;
  /** Total de productos en el carrito */
  cartProductTotal: number = 1;
  /** Información del usuario actual */
  user: Users;
  /** Gestiona las suscripciones para evitar memory leaks */
  subscription = new Subscription();

  /**
   * Constructor del componente
   * @param usersService Servicio para gestionar usuarios
   * @param authService Servicio de autenticación
   * @param router Router para la navegación
   * @param confirmationService Servicio para mostrar diálogos de confirmación
   * @param shoppingCartService Servicio para gestionar el carrito
   */
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private shoppingCartService: ShoppingCartService
  ) { }

  /**
   * Método lifecycle de inicialización
   */
  ngOnInit(): void {
    this.getData();
    this.getIdFromUrl();
    this.getSubscriptions();
  }

  /**
   * Obtiene el ID del carrito desde la URL actual
   * @returns El ID del carrito o '0' si es nuevo
   */
  getIdFromUrl(): string {
    const url = this.router.url;
    const cartId = url.split('/');
    const id = cartId[ cartId.length - 1 ];
    const localStorageCart = this.authService.getLocalStorage('shoppingCart')
      ;

    // Si es un carrito nuevo, intentamos recuperar datos del localStorage
    if (id === '0') {
      if (localStorageCart?._id) {
        const parsedCart = localStorageCart;
        // Verificar si el carrito en localStorage tiene _id
        if (parsedCart && parsedCart._id) {
          this.shoppingCart = parsedCart;
          this.updateCartTotals(parsedCart);
          this.shoppingCartService.checkUserCartStatus();
          return parsedCart._id;
        }
      }
      return '0';
    }
    // this.updateCartTotals(this.shoppingCart);
    return id;
  }

  /**
   * Obtiene los datos del carrito si el usuario está autenticado
   */
  getData(): void {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getSessionStorage('user');
      this.usersService
        .getShoppingCartById(this.getIdFromUrl())
        .subscribe((shoppingCart: ShoppingCart) => {
          this.shoppingCart = shoppingCart;
          this.updateCartTotals(shoppingCart);
        });
    }
  }

  /**
   * Configura las suscripciones para actualizar el carrito
   */
  getSubscriptions(): void {
    this.subscription.add(
      this.usersService.shoppingCart$.subscribe((cart) => {
        this.shoppingCart = cart;
        this.updateCartTotals(cart);
      })
    );
  }

  /**
   * Actualiza los totales del carrito (subtotal, impuestos, total)
   * @param cart Carrito de compras a calcular
   */
  updateCartTotals(cart: ShoppingCart): void {
    console.log(" updateCartTotals / cart:", cart);
    // Calcula el subtotal sumando (cantidad * precio) de cada producto
    this.subTotal = cart.products.reduce(
      (total: number, product: Product) =>
        (total += product.properties[ 0 ].quantity * product.price),
      0
    );

    // Calcula impuestos (21% sobre subtotal y envío)
    this.tax = this.subTotal * 0.21 + this.shipping * 0.21;

    // Calcula el total final
    this.total = this.subTotal + this.tax + this.shipping;
  }

  /**
   * Elimina un producto del carrito tras confirmación del usuario
   * @param id ID del producto a eliminar
   */
  removeProduct(id: string): void {
    this.confirmationService.confirm({
      target: document.body,
      message: '¿Estás seguro que deseas eliminar el producto?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shoppingCartService.removeProductFromCart(id);
      },
      reject: () => { /* No hacer nada si rechaza */ },
    });
  }

  /**
   * Navega a la página de detalle del producto
   * @param id ID del producto
   */
  navigateToProductDetail(id: string): void {
    this.router.navigate([ `/product/detail/${id}` ]);
  }

  /**
   * Limpia las suscripciones al destruir el componente
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Decrementa la cantidad de un producto en el carrito
   * @param event Objeto con el ID del producto y la talla seleccionada
   */
  decrementQuantity(event: { id: number, size: any }): void {
    const { id, size } = event;
    this.updateProductQuantity(id, size, -1);
  }

  /**
   * Incrementa la cantidad de un producto en el carrito
   * @param event Objeto con el ID del producto y la talla seleccionada
   */
  incrementQuantity(event: { id: number, size: any }) {
    const { id, size } = event;
    this.updateProductQuantity(id, size, 1);
  }

  /**
   * Método centralizado para actualizar la cantidad de productos
   * @param productId ID del producto
   * @param size Talla del producto (si es necesario)
   * @param change Cantidad a modificar (+1 incremento, -1 decremento)
   */
  private updateProductQuantity(productId: number, size: any, change: number): void {
    this.shoppingCart.products = this.shoppingCart.products.map((product) => {
      if (product.productId === productId) {
        if (product.type === 'composite') {
          // Para productos compuestos (con tallas)
          product.properties.forEach((property) => {
            property?.size?.forEach((s) => {
              if (s.size === size.size) {
                // No permitir cantidades negativas
                if (change < 0 && s.quantity <= 0) return s;
                s.quantity += change;
                product.properties[ 0 ].quantity += change;
              }
              return s;
            });
          });
        } else if (product.type === 'simple') {
          // Para productos simples
          if (change < 0 && product.properties[ 0 ].quantity <= 0) return product;
          product.properties[ 0 ].quantity += change;
        }
      }
      return product;
    });

    // Actualizar totales después de modificar cantidades
    this.updateCartTotals(this.shoppingCart);
  }

  /**
   * Procesa el pago del carrito actual
   * @param shoppingCart Carrito de compras a procesar
   */
  makePayment(shoppingCart: ShoppingCart): void {
    debugger;
    // Crear copia profunda para no modificar el original
    const payload = this.preparePayloadForCheckout(shoppingCart);

    // // Verificar estado del carrito
    // this.shoppingCartService.checkUserCartStatus();

    // Navegar a la página de checkout
    if (shoppingCart._id) {
      this.authService.setLocalStorage('shoppingCart', JSON.stringify(shoppingCart));
      this.usersService.shoppingCart$.next(shoppingCart);
      this.usersService.selectedProduct.set(shoppingCart.products[ 0 ]);
      this.shoppingCartService.checkUserCartStatus()
      this.router.navigate([ '/checkout', shoppingCart._id ]);
    } else {
      // Si no existe un carrito, crear uno nuevo
      this.usersService.createShoppingCart(payload).subscribe((cart) => {
        this.usersService.shoppingCart$.next(cart);
        this.authService.setLocalStorage('shoppingCart', JSON.stringify(cart));
        this.router.navigate([ `/checkout/${cart._id}` ]);
      });
    }
  }

  /**
   * Prepara el payload para el proceso de checkout,
   * eliminando productos con cantidad cero
   * @param shoppingCart Carrito original
   * @returns Payload limpio para checkout
   */
  private preparePayloadForCheckout(shoppingCart: ShoppingCart): ShoppingCart {
    // Crear copia profunda del carrito
    const payload = JSON.parse(JSON.stringify(shoppingCart));

    // Verificar si hay productos en el carrito
    if (payload.products.length === 0) return payload;

    // Filtrar productos según su tipo
    payload.products.forEach((product: Product) => {
      if (product.type === 'composite') {
        // Filtrar tallas con cantidad > 0
        product.properties.forEach((property) => {
          property.size = property?.size?.filter(s => s.quantity > 0);
        });

        // Eliminar productos sin tallas disponibles
        if (product.properties.every(property => property?.size?.length === 0)) {
          payload.products = payload.products.filter(
            (p: Product) => p.productId !== product.productId
          );
        }
      } else if (product.type === 'simple') {
        // Eliminar productos simples con cantidad <= 0
        if (product.properties[ 0 ].quantity <= 0) {
          payload.products = payload.products.filter(
            (p: Product) => p.productId !== product.productId
          );
        }
      }
    });

    return payload;
  }
}
