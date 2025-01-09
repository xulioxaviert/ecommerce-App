import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Products } from '../../../core/models/products.model';
import { HttpService } from '../../../core/services/http.service';
import { ENDPOINTS } from '../../../core/const/constants';

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
    private translateService: TranslateService,
    private http: HttpService
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


}
