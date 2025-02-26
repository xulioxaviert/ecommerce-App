import { DecimalPipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../auth/auth.service';
import { ShoppingCart } from '../../../core/models/cart.model';
import { Sales } from '../../../core/models/sales.model';
import { Users } from '../../../core/models/user.model';
import { EmailService } from '../../../core/services/email.service';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ NgIf, NgFor, UpperCasePipe, ReactiveFormsModule, TranslateModule, DecimalPipe ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  shoppingCart: ShoppingCart = {} as ShoppingCart;
  user: Users;
  checkOutForm: FormGroup = new FormGroup({});
  subtotal = 0;
  shipping = 0;
  tax = 0;
  total = 0;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.getIdFromUrl()
    this.getData();
    this.initForm();
  }

  getData(): void {

    this.usersService
      .getShoppingCartById(this.getIdFromUrl())
      .subscribe((shoppingCart: ShoppingCart) => {
        this.shoppingCart = shoppingCart;
        this.calculateTotal();
      });
    this.user = this.authService.getSessionStorage('user');

  }
  getIdFromUrl(): string {
    const url = this.router.url;
    const cartId = url.split('/');
    const id = cartId[ cartId.length - 1 ];
    return id;

  }

  initForm(): void {
    this.checkOutForm = this.fb.group({
      name: [ '', [ Validators.required, Validators.minLength(3) ] ],
      email: [
        '',
        [ Validators.required, Validators.minLength(3), Validators.email ],
      ],
      creditCardHoler: [ '', [ Validators.required, Validators.minLength(3) ] ],
      creditCardNumber: [ '', [ Validators.required, Validators.maxLength(19) ] ],
      expirationDate: [ '', [ Validators.required, Validators.maxLength(5) ] ],
      cvc: [ '', [ Validators.required, Validators.maxLength(3) ] ],
    });
    this.loadData();
  }

  loadData(): void {
    if (this.authService.isAuthenticated()) {
      this.checkOutForm.patchValue({
        name:
          this.user.name.firstname.toUpperCase() +
          ' ' +
          this.user.name.lastname.toUpperCase(),
        email: this.user.email,
        creditCardHoler:
          this.user.name.firstname.toUpperCase() +
          ' ' +
          this.user.name.lastname.toUpperCase(),
      });
    }
  }

  calculateTotal(): void {
    this.subtotal = this.shoppingCart.products.reduce((acc, product) => {
      return acc + product.price * product.properties[ 0 ].quantity
    }, 0);
    this.shipping = 10;
    this.tax = this.subtotal * 0.21;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  pay(): void {
    if (this.checkOutForm.valid) {
      const sales: any = {
        shoppingCart: this.shoppingCart,
        userId: this.shoppingCart.userId
      }
      const email = {
        to: 'pruebas_envio_correo@yopmail.com',
        subject: 'Pedido realizado correctamente',
        id: this.shoppingCart.id?.toLocaleUpperCase(),
        products: this.shoppingCart.products,
        date: new Date().toUTCString(),
        name: this.checkOutForm.value.name
      };
      const paymentData: Sales = {
        name: this.checkOutForm.value.name,
        email: this.checkOutForm.value.email,
        creditCardHoler: this.checkOutForm.value.creditCardHoler,
        creditCardNumber: this.checkOutForm.value.creditCardNumber,
        expirationDate: this.checkOutForm.value.expirationDate,
        cvc: this.checkOutForm.value.cvc,
        sales: [
          sales
        ]
      }
      console.log("pay / paymentData:", paymentData);
      this.usersService
        .createSale(paymentData)
        .subscribe(() => {
          this.router.navigate([ '/' ]);
          this.deleteShoppingCart(this.shoppingCart.id);
          if (!this.authService.isAuthenticated()) {
            this.authService.removeLocalStorage('shoppingCart');
            this.usersService.shoppingCart$.next({} as ShoppingCart);
          }
          // this.emailService.sendEMail(email).subscribe(() => {
          //   console.log('Email enviado correctamente');
          // });
          this.usersService.shoppingCart$.next({} as ShoppingCart);
        });
    } else {
      this.checkOutForm.markAllAsTouched();
      this.checkOutForm.setErrors({ valid: false });
    }

  }

  deleteShoppingCart(id?: string): void {
    if (id) {
      this.usersService.deleteShoppingCart(id).subscribe(response => {
        console.log(`se ha eliminado exitosamente el carrito${response.id}`, response);
      });
    } else {
      console.error('No se pudo eliminar el carrito: id no proporcionado');
    }
  }

  formatCreditCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    const formattedValue = value.replace(/(.{4})/g, '$1-').replace(/-$/, '');

    if (value.length < 16) {
      this.checkOutForm.setErrors({ valid: false });
    } else {
      this.checkOutForm.setErrors(null);
    }

    this.checkOutForm.patchValue({ creditCardNumber: formattedValue });
  }
  formatExpirationDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    const formattedValue = value.replace(/(\d{2})(\d{2})/, '$1/$2');

    if (value.length < 4) {
      this.checkOutForm.setErrors({ valid: false });
    } else {
      this.checkOutForm.setErrors(null);
    }

    this.checkOutForm.patchValue({ expirationDate: formattedValue });
  }
  formatCVC(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3);
    }

    if (value.length < 3) {
      this.checkOutForm.setErrors({ valid: false });
    } else {
      this.checkOutForm.setErrors(null);
    }

    this.checkOutForm.patchValue({ cvc: value });
  }
}
