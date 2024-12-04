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
import { catchError, map, of, switchMap } from 'rxjs';
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
    return this.loginForm.get('password');
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
            console.log("switchMap / token:", token);
            this.authService.setSessionStorage('token', token);
            return this.usersService.getAllUsers();
          }),
          map((users) => {
            users.forEach((user) => {
              if (user.username === payload.username) {
                //TODO: enviar al authServcie
                switch (user.username) {
                  case 'derek':
                    user.role = 'admin';
                    break;
                  case 'kevinryan':
                    user.role = 'admin';
                    break;
                  default:
                    user.role = 'costumer'
                    break;
                }


                this.authService.setSessionStorage(
                  'user',
                  JSON.stringify(user)
                );
                this.authService.isAuthenticated();
                this.router.navigate([ '/' ]);

              }
            });
          })
        )
        .subscribe({
          next: (data) => {
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
