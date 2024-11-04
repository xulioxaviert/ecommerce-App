import { NgClass, NgIf, NgSwitchCase } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { ENDPOINTS } from '../../core/const/constants';
import { ToastService } from '../../core/services/toast.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ NgSwitchCase, RouterLink, ReactiveFormsModule, NgClass, NgIf, TranslateModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @Output() registration = new EventEmitter();
  @Output() login = new EventEmitter();

  loginForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) { this.translateService.setDefaultLang('en'); }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [ '', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
    });
  }

  gotoRegistration(): void {
    this.registration.emit(true);
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
        .httpPostData(ENDPOINTS.login, payload)
        .pipe(
          switchMap(({ token }: any) => {
            this.authService.setSessionStorage('token', token);
            return this.usersService.getAllUsers();
          }),
          map((users) => {
            users.filter((user) => {
              user.username === username;
              this.authService.setSessionStorage('user', JSON.stringify(user));
            });
            return;
          })
        )
        .subscribe((filteredUsers) => {
          this.login.emit(true);
          this.authService.isAuthenticated();
          this.toastService.showMessage$.next(true);
          // this.toastService.show('success','Success','Login successful');
        });
    }
  }
  switchLanguage(language: string): void {
    this.translateService.use(language)
  }
}
