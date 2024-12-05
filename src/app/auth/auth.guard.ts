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
    const isAdmin = this.authService.isAdministrator()

    if (isAuthenticated && isAdmin) {
      return true;
    } else {
      this.router.navigate([ '/' ]);
      return false;
    }


  };
}
