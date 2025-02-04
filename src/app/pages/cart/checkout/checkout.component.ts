import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../auth/auth.service';
import { ShoppingCart } from '../../../core/models/cart.model';
import { Users } from '../../../core/models/user.model';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ NgIf, NgFor, UpperCasePipe, ReactiveFormsModule, TranslateModule ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  shoppingCart: ShoppingCart = {} as ShoppingCart;
  user: Users;
  checkOutForm: FormGroup = new FormGroup({});


  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getData()
    this.initForm()

  }

  getData(): void {

    this.usersService.getShoppingCartById(this.getIdFromUrl()).subscribe((shoppingCart: ShoppingCart) => {
      this.shoppingCart = shoppingCart;
    });
    this.user = this.authService.getSessionStorage('user')

  }
  getIdFromUrl(): string {
    const url = this.router.url;
    const cartId = url.split('/');
    return cartId[ cartId.length - 1 ];
  }

  initForm(): void {
    this.checkOutForm = this.fb.group({
      name: [ this.user, [ Validators.required, Validators.minLength(3) ] ],
      email: [ '', [ Validators.required, Validators.minLength(3), Validators.email ] ],
      creditCardHoler: [ '', [ Validators.required, Validators.minLength(3) ] ],
      creditCardNumber: [ '', [ Validators.required, Validators.minLength(3) ] ],
      expirationDate: [ '', [ Validators.required, Validators.minLength(3) ] ],
      cvc: [ '', [ Validators.required, Validators.minLength(3) ] ],
    });
    this.loadData()
  }

  loadData(): void {
    this.checkOutForm.patchValue({
      name: this.user.name.firstname.toUpperCase() + ' ' + this.user.name.lastname.toUpperCase(),
      email: this.user.email,
    })
  }

  pay(): void {

    this.usersService.deleteShoppingCart(this.shoppingCart.id).subscribe(() => {
      this.router.navigate([ '/' ]);
    });
    this.usersService.shoppingCart$.next({} as ShoppingCart)
  }
}


