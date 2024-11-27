import { Component, OnInit } from '@angular/core';
import { Products } from '../../core/models/products.model';
import { HttpService } from '../../core/services/http.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ENDPOINTS } from '../../core/const/constants';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ ButtonModule, TranslateModule, RouterOutlet ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit{
  products: Products[] = [];
  category: any;
  responsiveOptions;

  constructor(private http: HttpService, private translateService: TranslateService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];


  }

  ngOnInit(): void {
    this.getData();
    console.log('Home');

  }

  getData(): void {
    forkJoin([
      this.http.getData(ENDPOINTS.getAllProducts),
      this.http.getData(ENDPOINTS.getAllCategories),

    ]).subscribe(
      ([ products, categories ]) => {
        this.products = products.body;
        this.category = categories.body;
      }
    );


  }

}
