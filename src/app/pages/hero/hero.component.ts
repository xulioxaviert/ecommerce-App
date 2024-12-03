import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';
import { ENDPOINTS } from '../../core/const/constants';
import { Products } from '../../core/models/products.model';
import { HttpService } from '../../core/services/http.service';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ ButtonModule, TranslateModule, RouterOutlet, NgFor ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  categories: any[] = [];

  constructor(private http: HttpService, private translateService: TranslateService) {
    this.translateService.onDefaultLangChange.subscribe((event) => {
      this.changeLabelLanguage();
    });
  }

  ngOnInit(): void {
    this.getData();
    console.log('Home');

  }

  getData(): void {

    this.http.getData(ENDPOINTS.getAllCategories).subscribe((categories) => {
      console.log(categories.body);
      this.categories = [];
      categories.body.forEach((category: any) => {
        switch (category) {
          case 'electronics':
            this.categories.push({
              category: this.translateService.instant('CATEGORY.ELECTRONICS'),
              name: this.translateService.instant('CATEGORY.ELECTRONICS'),
              title: this.translateService.instant(
                'CATEGORY.ELECTRONICS_TITLE'
              ),
              descriptions: this.translateService.instant(
                'CATEGORY.ELECTRONICS_DESCRIPTIONS'
              ),
              img: 'assets/images/electronics.jpg',
            });
            break;
          case 'jewelery':
            this.categories.push({
              category: this.translateService.instant('CATEGORY.JEWELRY'),
              name: this.translateService.instant('CATEGORY.JEWELRY'),
              title: this.translateService.instant('CATEGORY.JEWELRY_TITLE'),
              descriptions: this.translateService.instant(
                'CATEGORY.JEWELRY_DESCRIPTIONS'
              ),
              img: 'assets/images/jewellery.jpg',
            });
            break;
          case "men's clothing":
            this.categories.push({
              category: this.translateService.instant('CATEGORY.MEN'),
              name: this.translateService.instant('CATEGORY.MEN'),
              title: this.translateService.instant('CATEGORY.MEN_TITLE'),
              descriptions: this.translateService.instant(
                'CATEGORY.MEN_DESCRIPTIONS'
              ),
              img: 'assets/images/men.jpg'
            });
            break;
          case "women's clothing":
            this.categories.push({
              category: this.translateService.instant('CATEGORY.WOMEN'),
              name: this.translateService.instant('CATEGORY.WOMEN'),
              title: this.translateService.instant('CATEGORY.WOMEN_TITLE'),
              descriptions: this.translateService.instant(
                'CATEGORY.WOMEN_DESCRIPTIONS'
              ),
              img: 'assets/images/women.jpg'
            });
            break;
        }
      });
    });


  }
  changeLabelLanguage() {
    this.getData();
  }



}
