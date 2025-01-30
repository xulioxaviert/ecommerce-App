import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ENDPOINTS } from '../../../core/const/constants';
import { Products } from '../../../core/models/products.model';
import { HttpService } from '../../../core/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jewelry',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './jewelry.component.html',
  styleUrl: './jewelry.component.scss',
})
export class JewelryComponent implements OnInit {
  products: Products[] = [];
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
        .filter((product: Products) => product.category === "jewelry")
        .forEach((product: Products) => this.products.push(product));
      console.log('products', this.products);
    })
  }
  navigateToProduct(product: Products) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }

}
