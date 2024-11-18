import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    TranslationDropdownComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() changeLanguage: any | undefined;
  lang = sessionStorage.getItem('language')
    ? sessionStorage.getItem('language')
    : 'en';

  categories = signal<string[]>([]);
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();
  items: MenuItem[] | undefined;

  constructor(
    private translateService: TranslateService,

  ) {
    this.translateService.setDefaultLang(this.lang || '');

  }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Women',
        icon: 'pi pi-shop',
      },
      {
        label: 'Mens',
        icon: 'pi pi-shop',
      },
      {
        label: 'Category',
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: 'Electronics',
            icon: 'pi pi-bolt',
          },
          {
            label: 'Jewelery',
            icon: 'pi pi-server',
          },
          {
            label: "Men's clothing",
            icon: 'pi pi-pencil',
          },
          {
            label: "Women's clothing",
            icon: 'pi pi-palette',
            items: [
              {
                label: 'Apollo',
                icon: 'pi pi-palette',
              },
              {
                label: 'Ultima',
                icon: 'pi pi-palette',
              },
            ],
          },
        ],
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
      },
    ];
  }
  
}
