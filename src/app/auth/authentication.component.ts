import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, NgSwitchCase, NgSwitch],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  phase: 'login' | 'registration' = 'login';
  constructor() { }

  showLogin() {
    this.phase = 'login';
  }

  showRegistration() {
    this.phase = 'registration';
  }
}
