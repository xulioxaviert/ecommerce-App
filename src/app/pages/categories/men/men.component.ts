import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { ENDPOINTS } from '../../../core/const/constants';
import { Product, ShoppingCart } from '../../../core/models/cart.model';
import { Users } from '../../../core/models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../shared/modal/product-modal-service.service';
import { ProductModal } from '../../../shared/modal/product-modal.component';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-mens',
  standalone: true,
  imports: [ CommonModule, NgForOf, TranslateModule, ProductModal, NgIf ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.scss',
  providers: [],
})
export class MenComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  currentProduct: Product = {} as Product;
  visible: boolean = false;
  subscription: Subscription = new Subscription();
  user: Users = {} as Users;
  shoppingCart: ShoppingCart = {} as ShoppingCart;

  constructor(
    private http: HttpService,
    private router: Router,
    private modalService: ModalService,
    private authService: AuthService,
    private usersService: UsersService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getSubscriptions();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "men's clothing")
        .forEach((product: Product) => this.products.push(product));
    });

  }


  getSubscriptions() {
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {

      })
    );
    this.subscription.add(

    );
  }

  navigateToProductDetail(product: Product) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ]);
  }
  openModalSize(product: Product) {
    this.visible = true;
    this.modalService.openModal(product);
  }

}
