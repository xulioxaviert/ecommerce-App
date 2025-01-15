import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../../core/models/products.model';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-products-detail',
  standalone: true,
  imports: [ UpperCasePipe, NgIf, NgFor ],
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.scss',
})
export class ProductsDetailComponent implements OnInit {
  productDetail: Products | undefined;
  stock: number | undefined;
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getData();
  }


  getData(): void {
    this.route.params.subscribe((params) => {
      this.getProductDetail(params[ 'id' ]);
    });
  }
  getProductDetail(id: string): void {
    this.http.getProductsById(id).subscribe((product) => {
      console.log("this.http.getProductsById / product:", product);
      this.productDetail = product;
      
    });
  }
}


