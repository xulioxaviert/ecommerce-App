import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Testimonial } from '../../core/models/testimonial.model';
import { HttpService } from '../../core/services/http.service';


@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [ NgForOf, TranslateModule, TranslateModule ],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss',
})
export class TestimonialComponent implements OnInit {
  testimonials: Testimonial[] = [];
  responsiveOptions: any[] | undefined;

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getData();
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getData() {
    this.http.getTestimonials().subscribe((testimonials) => {
      this.testimonials = testimonials;
      console.log("this.http.getTestimonials / testimonials:", testimonials);

    });

  }
  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'unknown';
    }
  }
}
