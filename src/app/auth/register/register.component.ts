import { Component, EventEmitter, Output } from '@angular/core';

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

}
