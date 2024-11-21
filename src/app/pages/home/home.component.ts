import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { forkJoin, take } from 'rxjs';
import { HeaderComponent } from '../../core/components/header/header.component';
import { ENDPOINTS } from '../../core/const/constants';
import { Products } from '../../core/models/products.model';
import { HttpService } from '../../core/services/http.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ HeaderComponent, CarouselModule, ButtonModule, TranslateModule, RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

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

  }

  getData(): void {
    
    forkJoin([
      this.http.getData(ENDPOINTS.getAllProducts),
      this.http.getData(ENDPOINTS.getAllCategories),

    ]).subscribe(
      ([ products, categories ]) => {
        this.products = products.body;
        this.category = categories.body;
        console.log('Communications History: ', products.body);
        console.log('Communications History: ', categories.body);
      }
    );


  }



}
