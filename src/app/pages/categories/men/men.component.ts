import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ENDPOINTS } from '../../../core/const/constants';
import { Product } from '../../../core/models/cart.model';
import { HttpService } from '../../../core/services/http.service';
import { ModalService } from '../../../shared/modal/product-modal-service.service';
import { ProductModal } from "../../../shared/modal/product-modal.component";

@Component({
  selector: 'app-mens',
  standalone: true,
  imports: [ CommonModule, NgForOf, TranslateModule, ProductModal, NgIf ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.scss',
  providers: []
})
export class MenComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product = {} as Product;
  visible: boolean = false;




  constructor(private http: HttpService, private router: Router, private modalService: ModalService) { }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "men's clothing")
        .forEach((product: Product) => this.products.push(product));
      console.log('products', this.products);
    });
  }
  navigateToProductDetail(product: Product) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }
  openModalSize(product: Product) {
    this.visible = true;
    this.modalService.openModal(product);


  }


}
