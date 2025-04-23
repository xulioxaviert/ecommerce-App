import { Inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../models/cart.model';
import { Users } from '../models/user.model';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoriteProductsService {
  private favoriteProducts$ = new BehaviorSubject<Product[]>([]);
  selectedFavorite = signal({} as Product);

  constructor(
    private authService: AuthService,
    private httpService: HttpClient
  ) {
    this.loadFavorites();
  }

  /**
   * Carga los productos favoritos desde el almacenamiento apropiado
   * (localStorage para usuarios no autenticados, servidor para usuarios autenticados)
   */
  loadFavorites(): void {
    if (this.authService.isAuthenticated()) {
      this.loadFavoritesFromServer();
    } else {
      this.loadFavoritesFromLocal();
    }
  }

  /**
   * Carga los productos favoritos desde el servidor para usuarios autenticados
   */
  loadFavoritesFromServer(): void {
    const user = this.authService.getSessionStorage('user');
    if (user && user.userId) {
      this.httpService.get<Product[]>(`favorites/${user.userId}`).subscribe({
        next: (favorites: Product[]) => {
          this.favoriteProducts$.next(favorites);
          this.authService.setLocalStorage('favoriteProducts', JSON.stringify(favorites));
        },
        error: () => {
          this.favoriteProducts$.next([]);
          this.authService.setLocalStorage('favoriteProducts', JSON.stringify([]));
        }
      });
    }
  }

  /**
   * Carga los productos favoritos desde localStorage para usuarios no autenticados
   */
  loadFavoritesFromLocal(): void {
    const favorites = this.authService.getLocalStorage('favoriteProducts');
    if (favorites) {
      this.favoriteProducts$.next(favorites);
    } else {
      this.favoriteProducts$.next([]);
      this.authService.setLocalStorage('favoriteProducts', JSON.stringify([]));
    }
  }

  /**
   * Obtiene el observable de productos favoritos
   */
  getFavoriteProducts() {
    return this.favoriteProducts$.asObservable();
  }

  /**
   * Obtiene el valor actual de productos favoritos
   */
  getCurrentFavorites(): Product[] {
    return this.favoriteProducts$.getValue();
  }

  /**
   * Agrega un producto a favoritos
   * @param product Producto a agregar a favoritos
   */
  addToFavorites(product: Product): void {
    const currentFavorites = this.getCurrentFavorites();

    // Verificar si el producto ya está en favoritos
    if (!currentFavorites.some(p => p._id === product._id)) {
      const updatedFavorites = [...currentFavorites, product];

      if (this.authService.isAuthenticated()) {
        const user = this.authService.getSessionStorage('user');
        this.httpService.post<any>(`favorites/${user.userId}`, { product }).subscribe({
          next: () => {
            this.favoriteProducts$.next(updatedFavorites);
          }
        });
      } else {
        this.favoriteProducts$.next(updatedFavorites);
        this.authService.setLocalStorage('favoriteProducts', JSON.stringify(updatedFavorites));
      }
    }
  }

  /**
   * Elimina un producto de favoritos
   * @param productId ID del producto a eliminar
   */
  removeFromFavorites(productId: string): void {
    const currentFavorites = this.getCurrentFavorites();
    const updatedFavorites = currentFavorites.filter(p => p._id !== productId);

    if (this.authService.isAuthenticated()) {
      const user = this.authService.getSessionStorage('user');
      this.httpService.delete<any>(`favorites/${user.userId}/${productId}`).subscribe({
        next: () => {
          this.favoriteProducts$.next(updatedFavorites);
        }
      });
    } else {
      this.favoriteProducts$.next(updatedFavorites);
      this.authService.setLocalStorage('favoriteProducts', JSON.stringify(updatedFavorites));
    }
  }

  /**
   * Verifica si un producto está en favoritos
   * @param productId ID del producto a verificar
   * @returns true si el producto está en favoritos, false en caso contrario
   */
  isFavorite(productId: string): boolean {
    return this.getCurrentFavorites().some(p => p._id === productId);
  }

  /**
   * Sincroniza los favoritos locales con el servidor cuando un usuario inicia sesión
   * @param user Usuario autenticado
   */
  syncFavoritesOnLogin(user: Users): void {
    const localFavorites = this.authService.getLocalStorage('favoriteProducts') || [];

    if (localFavorites.length > 0) {
      this.httpService.post<Product[]>(`favorites/${user.userId}/sync`, { products: localFavorites }).subscribe({
        next: (serverFavorites: Product[]) => {
          this.favoriteProducts$.next(serverFavorites);
          this.authService.removeLocalStorage('favoriteProducts');
        }
      });
    } else {
      this.loadFavoritesFromServer();
    }
  }

  /**
   * Limpia los favoritos al cerrar sesión
   */
  clearFavoritesOnLogout(): void {
    const currentFavorites = this.getCurrentFavorites();
    this.authService.setLocalStorage('favoriteProducts', JSON.stringify(currentFavorites));
    this.favoriteProducts$.next([]);
  }
}
