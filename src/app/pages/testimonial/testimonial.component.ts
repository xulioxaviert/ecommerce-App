import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Testimonial } from '../../core/models/testimonial.model';
import { HttpService } from '../../core/services/http.service';
import { testimonials } from '../../core/mocks/mock-data';


@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss',
})
export class TestimonialComponent implements OnInit {
  testimonials: Testimonial[] = [];
  testimonialTexts: string[]= [''];

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
      console.log("this.http.getTestimonials / testimonials:", testimonials);
      this.testimonials = testimonials;
    });

  }

}
