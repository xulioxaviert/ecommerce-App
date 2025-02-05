import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ENDPOINTS } from '../../../core/const/constants';
import { Product } from '../../../core/models/cart.model';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-jewelry',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './jewelry.component.html',
  styleUrl: './jewelry.component.scss',
})
export class JewelryComponent implements OnInit {
  products: Product[] = [];
  constructor(
    private translateService: TranslateService,
    private http: HttpService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "jewelry")
        .forEach((product: Product) => this.products.push(product));
      console.log('products', this.products);
    })
  }
  navigateToProduct(product: Product) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }

}
