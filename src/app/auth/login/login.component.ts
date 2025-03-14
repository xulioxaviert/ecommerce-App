import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, NgIf, TranslateModule, NgClass, RouterLink ],
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService,
    private router: Router
  ) { }

  // Método del ciclo de vida que se ejecuta al inicializar el componente.
  ngOnInit(): void {
    this.createLoginForm();
  }

  /**
   * Crea el formulario de login con los campos 'email' y 'password'
   * y establece las validaciones necesarias.
   */
  createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.minLength(3), Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength(3) ] ],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Método que se ejecuta al hacer "sign in".
   * - Valida el formulario.
   * - Realiza la autenticación y, si es exitosa, actualiza la sesión.
   * - Recupera el carrito de compras del usuario.
   * - Navega a la página principal.
   */
  signIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService
      .login(email, password)
      .pipe(
        tap((response: any) => {
          this.authService.setSessionStorage('token', response.token);
          this.authService.setSessionStorage('user', JSON.stringify(response.user));
          this.authService.isAuthenticated$.next(true);
        }),
        switchMap((data) => {
          return this.usersService.getShoppingCartByUserId(data.user.userId);
        }),
        tap((cart: any) => {
          this.usersService.shoppingCart$.next(cart);
        }),
        catchError((error) => {
          this.toastService.showError('Error', error);
          this.loginForm.reset();
          return EMPTY;
        })
      ).subscribe({
        next: () => this.router.navigate([ '/' ]),
        complete: () => console.log('.subscribe / complete'),
      });
  }
}
