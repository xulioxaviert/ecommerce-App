import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ENDPOINTS } from '../../../core/const/constants';
import { Product } from '../../../core/models/cart.model';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-electronics',
  standalone: true,
  imports: [ NgForOf, TranslateModule, RouterOutlet ],
  templateUrl: './electronics.component.html',
  styleUrl: './electronics.component.scss',
})
export class ElectronicsComponent implements OnInit {
  products: Product[] = [];
  constructor(
    private http: HttpService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllProducts).subscribe((products) => {
      products.body
        .filter((product: Product) => product.category === "electronics")
        .forEach((product: Product) => this.products.push(product));
      console.log('products', this.products);
    })
  }
  navigateToProduct(product: Product) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }


}
