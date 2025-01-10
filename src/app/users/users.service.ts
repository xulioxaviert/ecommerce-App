import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ENDPOINTS } from '../core/const/constants';
import { ShoppingCart } from '../core/models/cart.model';
import { Users } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  shoppingCart$: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>({} as ShoppingCart);

  constructor(private _httpClient: HttpClient) { }

  getUsers(id: number): Observable<Users> {
    return this._httpClient.get<Users>(`${ENDPOINTS.getUser}${id}`);
  }

  getAllUsers(): Observable<Users[]> {
    return this._httpClient.get<Users[]>(ENDPOINTS.getAllUsers);
  }

  getUserByUsername(username: string): Observable<Users> {

    return this.getAllUsers().pipe(
      map((users: Users[]) => {
        const user = users.find(user => user.username === username);
        if (user) {
          switch (user.username) {
            case 'derek':
              user.role = 'admin';
              break;
            case 'kevinryan':
              user.role = 'admin';
              break;
            default:
              user.role = 'customer';
              break;
          }
        } else {
          throw new Error('User not found');
        }
        return user;
      })
    );

  }

  getAllShoppingCarts(): Observable<ShoppingCart[]> {
    return this._httpClient.get<ShoppingCart[]>(ENDPOINTS.getAllShoppingCarts)
  }
  
  getShoppingCartById(id: number): Observable<ShoppingCart> {
    return this.getAllShoppingCarts().pipe(
      map((carts: ShoppingCart[]) => {
        const cart = carts.find(cart => cart.userId === id);
        if (cart) {
          return cart;
        } else {
          throw new Error('Cart not found');
        }
      })
    )
  }
}
