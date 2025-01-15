import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ENDPOINTS } from '../../../core/const/constants';
import { Products } from '../../../core/models/products.model';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-electronics',
  standalone: true,
  imports: [ NgForOf, TranslateModule, RouterOutlet ],
  templateUrl: './electronics.component.html',
  styleUrl: './electronics.component.scss',
})
export class ElectronicsComponent implements OnInit {
  products: Products[] = [];
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
        .filter((product: Products) => product.category === "electronics")
        .forEach((product: Products) => this.products.push(product));
      console.log('products', this.products);
    })
  }
  navigateToProduct(product: Products) {
    console.log('product', product);
    this.router.navigate([ `/product/detail/${product.id}` ])

  }


}
