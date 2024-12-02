import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ NgForOf, TranslateModule, RouterOutlet, ChartModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  data: any;

  options: any;
  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getData();
    this.translateService.onDefaultLangChange.subscribe((event) => {
      // this.changeLabelLanguage();
    });
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [ 65, 59, 80, 81, 56, 55, 40 ]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [ 28, 48, 40, 19, 86, 27, 90 ]
        }
      ]
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    };
  }

  getData() {
    // this.http.getData(ENDPOINTS.getAllCategories).subscribe((categories) => {
    //   console.log(categories.body);
    //   this.categories = [];
    //   categories.body.forEach((category: any) => {
    //     switch (category) {
    //       case 'electronics':
    //         this.categories.push({
    //           category: this.translateService.instant('CATEGORY.ELECTRONICS'),
    //           name: this.translateService.instant('CATEGORY.ELECTRONICS'),
    //           title: this.translateService.instant(
    //             'CATEGORY.ELECTRONICS_TITLE'
    //           ),
    //           descriptions: this.translateService.instant(
    //             'CATEGORY.ELECTRONICS_DESCRIPTIONS'
    //           ),
    //           img: 'assets/images/electronics.jpg',
    //         });
    //         break;
    //       case 'jewelery':
    //         this.categories.push({
    //           category: this.translateService.instant('CATEGORY.JEWELRY'),
    //           name: this.translateService.instant('CATEGORY.JEWELRY'),
    //           title: this.translateService.instant('CATEGORY.JEWELRY_TITLE'),
    //           descriptions: this.translateService.instant(
    //             'CATEGORY.JEWELRY_DESCRIPTIONS'
    //           ),
    //           img: 'assets/images/jewellery.jpg',
    //         });
    //         break;
    //       case "men's clothing":
    //         this.categories.push({
    //           category: this.translateService.instant('CATEGORY.MEN'),
    //           name: this.translateService.instant('CATEGORY.MEN'),
    //           title: this.translateService.instant('CATEGORY.MEN_TITLE'),
    //           descriptions: this.translateService.instant(
    //             'CATEGORY.MEN_DESCRIPTIONS'
    //           ),
    //           img: 'assets/images/men.jpg'
    //         });
    //         break;
    //       case "women's clothing":
    //         this.categories.push({
    //           category: this.translateService.instant('CATEGORY.WOMEN'),
    //           name: this.translateService.instant('CATEGORY.WOMEN'),
    //           title: this.translateService.instant('CATEGORY.WOMEN_TITLE'),
    //           descriptions: this.translateService.instant(
    //             'CATEGORY.WOMEN_DESCRIPTIONS'
    //           ),
    //           img: 'assets/images/women.jpg'
    //         });
    //         break;
    //     }
    //   });
    // });
  }


}
