import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ NgForOf, TranslateModule, RouterOutlet, HeaderComponent ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {



}
