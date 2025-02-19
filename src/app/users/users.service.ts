import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENDPOINTS } from '../core/const/constants';
import { Product, ShoppingCart, Stock } from '../core/models/cart.model';
import { Favorites } from '../core/models/favorites.model';
import { Sales } from '../core/models/sales.model';
import { Users } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  shoppingCart$: BehaviorSubject<ShoppingCart> =
    new BehaviorSubject<ShoppingCart>({} as ShoppingCart);
  favoriteProducts$: BehaviorSubject<ShoppingCart> =
    new BehaviorSubject<ShoppingCart>({} as ShoppingCart);

  selectedProduct = signal<Product>({} as Product);


  constructor(private _httpClient: HttpClient) { }

  getUsers(id: number): Observable<Users> {
    return this._httpClient.get<Users>(`${ENDPOINTS.getUser}${id}`);
  }

  getAllUsers(): Observable<Users[]> {
    return this._httpClient.get<Users[]>(ENDPOINTS.getAllUsers);
  }

  getUserByUsername(username: string): Observable<Users> {
    return this._httpClient.get<Users>(
      `${ENDPOINTS.getAllUsers}?username=${username}`
    );
  }

  getAllShoppingCarts(): Observable<ShoppingCart[]> {
    return this._httpClient.get<ShoppingCart[]>(ENDPOINTS.getAllShoppingCarts);
  }

  getShoppingCartByUserId(id: number): Observable<ShoppingCart[]> {
    return this._httpClient.get<ShoppingCart[]>(
      `${ENDPOINTS.getAllShoppingCarts}?userId=${id}`
    );
  }
  getShoppingCartById(id: string): Observable<ShoppingCart> {
    return this._httpClient.get<ShoppingCart>(
      `${ENDPOINTS.getAllShoppingCarts}/${id}`
    );
  }
  getAllFavoriteProducts(): Observable<Favorites[]> {
    return this._httpClient.get<Favorites[]>(ENDPOINTS.getAllFavoriteProducts);
  }
  getFavoriteProductById(id: number): Observable<Favorites> {
    return this._httpClient.get<Favorites>(
      `${ENDPOINTS.getAllFavoriteProducts}?userId=${id}`
    );
  }
  putShoppingCart(id: any, data: any): Observable<ShoppingCart> {
    return this._httpClient.put<ShoppingCart>(
      `${ENDPOINTS.getAllShoppingCarts}/${id}`,
      data
    );
  }
  deleteShoppingCart(id: string): Observable<ShoppingCart> {
    return this._httpClient.delete<ShoppingCart>(`${ENDPOINTS.getAllShoppingCarts}/${id}`)
  }
  createSale(sale: Sales): Observable<Sales> {
    return this._httpClient.post<Sales>(`${ENDPOINTS.getAllSales}`, sale)
  }

  createShoppingCart(data: any): Observable<ShoppingCart> {
    return this._httpClient.post<ShoppingCart>(
      ENDPOINTS.getAllShoppingCarts,
      data
    );
  }

  getStockAllProducts(): Observable<Stock[]> {
    return this._httpClient.get<Stock[]>(ENDPOINTS.getStockAllProducts);
  }


}
