import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ENDPOINTS } from '../../../core/const/constants';
import { HttpService } from '../../../core/services/http.service';
import { Product } from '../../../core/models/cart.model';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './women.component.html',
  styleUrl: './women.component.scss',
})
export class WomenComponent implements OnInit {
  products: Product[] = [];

  constructor(private http: HttpService, private router: Router) { }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "women's clothing")
        .forEach((product: Product) => this.products.push(product));
      console.log('products', this.products);
    });
  }
  navigateToProduct(product: Product) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }
}
