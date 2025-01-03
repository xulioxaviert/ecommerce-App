import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { ENDPOINTS } from '../../core/const/constants';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonModule, TranslateModule, RouterOutlet, NgFor],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  subscription = new Subscription();

  constructor(
    private http: HttpService,
    private translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getData();
    this.getSubscriptions();
  }

  getData(): void {
    this.http.getData(ENDPOINTS.getAllCategories).subscribe((categories) => {
      console.log('hero', categories.body);
      this.categories = [];
      categories.body.forEach((category: any) => {
        switch (category.title) {
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
              img: 'assets/images/men.jpg',
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
              img: 'assets/images/women.jpg',
            });
            break;
        }
      });
    });
  }
  getSubscriptions() {
    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => {
        console.log('change language');
        this.getData();
      })
    );
  }
}
