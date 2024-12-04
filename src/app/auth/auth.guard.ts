import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate: CanActivateFn = (route, state) => {
    // Check if the user is authenticated
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate([ '/login' ]);
      return false;
    }
  };
}
