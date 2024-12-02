import { NgForOf } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ENDPOINTS } from '../../core/const/constants';
import { CategoryFake } from '../../core/models/products.model';
import { HttpService } from '../../core/services/http.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ NgForOf, TranslateModule, RouterOutlet ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  // changeLanguage = input();
  categories: CategoryFake[] = [];

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getData();
    this.translateService.onDefaultLangChange.subscribe((event) => {
      this.changeLabelLanguage();
    });
  }

  getData() {
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

  //TODO:  Revisar con Mario la traducción de las categoría si se limpia o no
  changeLabelLanguage() {
    this.getData();
  }
}
