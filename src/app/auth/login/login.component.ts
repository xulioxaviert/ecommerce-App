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

    // Ejecutamos el login a través del servicio de autenticación.
    this.authService
      .login(email, password)
      .pipe(
        // Al recibir la respuesta, guardamos el token en sessionStorage.
        tap((response: any) => {
          this.authService.setSessionStorage('token', response.token);
        }),
        // Con switchMap, encadenamos la obtención del carrito una vez que el login es exitoso.
        switchMap((data) => {
          // Guardamos la información del usuario en sessionStorage.
          this.authService.setSessionStorage('user', JSON.stringify(data.user));
          // Indicamos que el usuario está autenticado actualizando el BehaviorSubject.
          this.authService.isAuthenticated$.next(true);

          // Retornamos el observable que obtiene el carrito del usuario.
          return this.usersService.getShoppingCartByUserId(data.user.userId);
        }),
        // Una vez obtenido el carrito, actualizamos el BehaviorSubject correspondiente.
        tap((cart: any) => {
          this.usersService.shoppingCart$.next(cart);
        }),
        // Si ocurre algún error en cualquiera de los pasos, lo capturamos, mostramos un toast de error,
        // reseteamos el formulario y retornamos EMPTY para detener la cadena.
        catchError((error) => {
          this.toastService.showError('Error', error);
          this.loginForm.reset();
          return EMPTY;
        })
      )
      .subscribe({
        // En caso de éxito, navegamos a la página principal.
        next: () => this.router.navigate([ '/' ]),
        complete: () => console.log('.subscribe / complete'),
      });
  }
}
