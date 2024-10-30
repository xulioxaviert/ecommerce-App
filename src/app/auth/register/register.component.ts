import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Output() registered = new EventEmitter<boolean>();
  registeredUser() {
    this.registered.emit(true);
  }
  constructor(private authService: AuthService) { }
}
