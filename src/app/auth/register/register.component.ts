import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, NgIf, NgFor, TranslateModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  @Output() registered = new EventEmitter<boolean>();
  registeredUser() {
    this.registered.emit(true);
  }

  registerForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {
  }


  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstname: [ '', [ Validators.required, Validators.minLength(3) ] ],
      lastname: [ '', [ Validators.required, Validators.minLength(3) ] ],
      username: [ '', [ Validators.required, Validators.minLength(3) ] ],
      password: [ '', [ Validators.required, Validators.minLength(3) ] ],
      confirmPassword: [ '', [ Validators.required, Validators.minLength(3) ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      address: [ '', [ Validators.required, Validators.minLength(3) ] ],
      phone: [ '', [ Validators.required ] ],
      city: [ '', [ Validators.required, Validators.minLength(3) ] ],
      street: [ '', [ Validators.required, Validators.minLength(3) ] ],
      number: [ '', [ Validators.required, Validators.minLength(3) ] ],
      zipcode: [ '', [ Validators.required, Validators.minLength(3) ] ],
    });
  }
}
