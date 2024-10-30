import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  @Output() registered = new EventEmitter<boolean>();
  registeredUser() {
    this.registered.emit(true);
  }

  registerForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthService, private fb: FormBuilder, private usersService: UsersService) { }


  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstname: [ '', [ Validators.required ] ],
      lastname: [ '', [ Validators.required ] ],
      phone: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      username: [ '', [ Validators.required, Validators.minLength(3) ] ],
      password: [ '', [ Validators.required, Validators.minLength(3) ] ],
      city: [ '', [ Validators.required, Validators.minLength(3) ] ],
      street: [ '', [ Validators.required, Validators.minLength(3) ] ],
      number: [ '', [ Validators.required, Validators.minLength(3) ] ],
      zipcode: [ '', [ Validators.required, Validators.minLength(3) ] ],
    });
  }

}
