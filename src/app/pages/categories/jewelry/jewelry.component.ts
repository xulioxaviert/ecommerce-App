import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../auth/auth.service';
import { ENDPOINTS } from '../../../core/const/constants';
import { Product, ShoppingCart } from '../../../core/models/cart.model';
import { Users } from '../../../core/models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { ModalService } from '../../../shared/modal/product-modal-service.service';
import { ProductModal } from '../../../shared/modal/product-modal.component';

@Component({
  selector: 'app-mens',
  standalone: true,
  imports: [ CommonModule, NgForOf, TranslateModule, ProductModal, NgIf ],
  templateUrl: './jewelry.component.html',
  styleUrl: './jewelry.component.scss',
  providers: [],
})
export class JewelryComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product = {} as Product;
  visible: boolean = false;
  user: Users = {} as Users;
  shoppingCart: ShoppingCart = {} as ShoppingCart;

  constructor(
    private http: HttpService,
    private router: Router,
    private modalService: ModalService,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "jewelry")
        .forEach((product: Product) => this.products.push(product));
    });

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
