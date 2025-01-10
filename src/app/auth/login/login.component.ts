import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, NgIf, TranslateModule, NgClass, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [ '', [ Validators.required, Validators.minLength(3) ] ],
      password: [ '', [ Validators.required, Validators.minLength(3) ] ],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  //quiero hacer un metodo que se active cuando el isAuthenticaded$ cambie
  // y si es true, que redirija a la pagina principal
  // y si es false, que no haga nada


  singIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService
        .login(username, password)
        .pipe(
          tap((response: any) => {
            this.authService.setSessionStorage('token', response.token);
          }),
          switchMap(() => this.usersService.getUserByUsername(username)),
          catchError((error) => {
            return of(error);
          })
        ).subscribe({
          next: (data) => {
            console.log("singIn / data:", data.userId);
            this.authService.user$.next(data);
            console.log('.subscribe / next', data);
            this.authService.setSessionStorage('user', JSON.stringify(data));
            this.router.navigate([ '/' ]);
            this.authService.isAuthenticated$.next(true);
            this.usersService.getShoppingCartById(data.userId).subscribe((cart) => {
              console.log("this.usersService.getShoppingCartById / cart:", cart);
              this.usersService.shoppingCart$.next(cart);
            })
          },
          error: (error) => {
            // const errorMessage = this.translateService.instant('ERROR.LOGIN');
            this.toastService.showError('Error', error);
            this.loginForm.reset();
          },
          complete: () => {
            console.log('.subscribe / complete');
          },
        });
    }
  }
}
