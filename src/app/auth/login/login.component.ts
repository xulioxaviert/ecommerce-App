import { NgClass, NgIf, NgSwitchCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterEvent, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, NgIf, TranslateModule, NgClass,RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup = new FormGroup({});
  lang = sessionStorage.getItem('language')
    ? sessionStorage.getItem('language')
    : 'en';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private router: Router
  ) {
  }

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
    return this.loginForm.get('username');
  }

  singIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      const payload = {
        username,
        password,
      };
      this.authService
        .login(username, password)
        .pipe(
          catchError((error) => {
            console.log('error:', error)
            return of(error);
          }),
          switchMap(({ token }: any) => {
            this.authService.setSessionStorage('token', token);
            return this.usersService.getAllUsers();
          }),
          map((users) => {
            users.forEach((user) => {
              if (user.username === payload.username) {
                this.authService.setSessionStorage(
                  'user',
                  JSON.stringify(user)
                );
                this.authService.isAuthenticated();
                this.translateService.use('es');
                this.authService.setLocalStorage('language', 'es')
                this.router.navigate([ '/' ]);

              }
            });
          })
        )
        .subscribe({
          next: (data) => {
          },
          error: (error) => {
            const errorMessage = this.translateService.instant('ERROR.LOGIN');
            this.toastService.showError('Error', errorMessage);
            this.loginForm.reset();
          },
          complete: () => {
            console.log('.subscribe / complete');

          },
        });
    }
  }

}
