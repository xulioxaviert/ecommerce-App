import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Testimonial } from '../../core/models/testimonial.model';
import { HttpService } from '../../core/services/http.service';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ NgForOf, TranslateModule, TranslateModule, CarouselModule, ButtonModule, TagModule ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  testimonials: Testimonial[] = [];
  responsiveOptions: any[] | undefined;

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getData();

  }

  getData() {
    //Preguntó Mario traducciones cuando se hace peticiones al API
    this.http.getTestimonials().subscribe((testimonials) => {
      this.testimonials = testimonials;
      console.log("this.http.getTestimonials / testimonials:", testimonials);

    });

  }

}
