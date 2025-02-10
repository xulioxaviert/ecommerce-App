import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  canActivate: CanActivateFn = (route, state) => {
    if (this.authService.isAuthenticated()) {
      return this.usersService
        .getShoppingCartByUserId(
          this.authService.getSessionStorage('user').userId
        )
        .pipe(
          map((shoppingCart) => {
            if (shoppingCart.length > 0) {
              return true;
            } else {
              this.router.navigate([ '/' ]);
              return false;
            }
          })
        );
    } else {
      const shoppingCart = this.authService.getLocalStorage('shoppingCart');
      if (shoppingCart.userId === null) {

        return true;
      } else {
        this.router.navigate([ '/' ]);
        return false;
      }
    }
  };
}
