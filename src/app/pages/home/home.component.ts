import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { HeaderComponent } from '../../core/components/header/header.component';
import { HttpService } from '../../core/services/http.service';
import { HeroComponent } from "../hero/hero.component";
import { CategoriesComponent } from "../categories/categories.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CarouselModule, ButtonModule, TranslateModule, RouterOutlet, HeroComponent, CategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private http: HttpService, private translateService: TranslateService) { }





}
