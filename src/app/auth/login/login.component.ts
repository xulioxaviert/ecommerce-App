import { NgSwitchCase } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgSwitchCase, RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() registration = new EventEmitter();
  @Output() login = new EventEmitter();


  gotoRegistration(): void {
    this.registration.emit(true);
  }
}
