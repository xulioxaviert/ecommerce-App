import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';
import { Users } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    TranslationDropdownComponent,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgClass,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  categories = signal<string[]>([]);
  isAuthenticated: boolean = false;
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();

  items: MenuItem[] | undefined;

  formGroup!: FormGroup;
  user: Users | undefined;
  initialsName: string = '';
  title: string = '';
  isVisible: boolean = true;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkAuthenticated();
    this.translateService.onLangChange.subscribe((event) => {
      this.updateItemLanguage();
    });
  }

  checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.user = this.authService.getSessionStorage('user');
      if (this.user) {
        switch (this.user.role) {
          case 'admin':
            this.isVisible = true;
            break;
          case 'costumer':
            this.isVisible = false;
            break;
        }
      }
      this.initialsName =
        (this.user?.name?.firstname.toUpperCase().toString().charAt(0) || '') +
        (this.user?.name?.lastname.toUpperCase().toString().charAt(0) || '');
      this.title = this.translateService.instant('HEADER.LOGOUT');
    } else {
      this.title = this.translateService.instant('HEADER.LOGIN');
      this.isAuthenticated = false;
      this.isVisible = false;
    }
    this.updateItemLanguage();
  }

  updateItemLanguage() {
    if (this.isAuthenticated) {
      this.title = this.translateService.instant('HEADER.LOGOUT');
    } else {
      this.title = this.translateService.instant('HEADER.LOGIN');
    }
    // if (this.user?.role === 'admin') {
    //   this.isVisible = true;
    // } else {
    //   this.isVisible = false;
    // }

    this.items = [
      {
        label: this.translateService.instant('HEADER.HOME'),
        icon: 'pi pi-home',
        visible: true,
        // route: '/',
        command: () => {
          this.router.navigate(['/']);
        }
      },
      {
        label: this.translateService.instant('HEADER.WOMEN'),
        icon: 'pi pi-shop',
        visible: true,
         route: '/categories/women',
         //Quiero una ruta que me lleve al apartado de testimonio

        // command: () => {
        //   this.router.navigate(['/categories/women']);
        // }
      },
      {
        label: this.translateService.instant('HEADER.MEN'),
        icon: 'pi pi-shop',
        visible: true,
        command: () => {
          const element = document.getElementById('heroCategories')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }

      },
      {
        label: this.translateService.instant('HEADER.CATEGORY'),
        icon: 'pi pi-shopping-bag',
        visible: true,
        route: '/categories',
        items: [
          {
            label: this.translateService.instant('HEADER.ELECTRONICS'),
            icon: 'pi pi-bolt',
            visible: true,
            route: '/categories/electronics',

          },
          {
            label: this.translateService.instant('HEADER.JEWELRY'),
            icon: 'pi pi-server',
            visible: true,
            route: '/categories/jewelry',
          },
          {
            label: this.translateService.instant('HEADER.MEN_CLOTHING'),
            icon: 'pi pi-pencil',
            visible: true,
            route: '/categories/mens',
          },
          {
            label: this.translateService.instant('HEADER.WOMEN_CLOTHING'),
            icon: 'pi pi-palette',
            visible: true,
            route: '/categories/women',
          },
        ],
      },
      {
        label: this.translateService.instant('HEADER.PRODUCTS'),
        icon: 'pi pi-shop',
        visible: true,
      },
      {
        label: this.translateService.instant('HEADER.CONTACT'),
        icon: 'pi pi-envelope',
        visible: true,
      },
      {
        label: this.translateService.instant('HEADER.DASHBOARD'),
        icon: 'pi pi-shop',
        visible: this.isVisible,
        route: '/dashboard',
      },
    ];
  }

  toggleAuthentication() {
    if (this.isAuthenticated === false) {
      this.router.navigate(['/auth/login']);
    } else {
      this.authService.logout();
      this.isAuthenticated = false;
      this.title = this.translateService.instant('HEADER.LOGIN');
      this.isVisible = false;
      this.updateItemLanguage();
    }
  }
}
