import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
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
    ToggleButtonModule,
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

  constructor(
    private translateService: TranslateService,
    private route: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.updateItemLanguage();
    this.checkAuthenticated();
    this.translateService.onLangChange.subscribe((event) => {
      this.updateItemLanguage();
    });
  }

    checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.user = this.authService.getSessionStorage('user');
      console.log('checkAuthenticated / this.user:', this.user);
      this.initialsName =
        (this.user?.name?.firstname.toUpperCase().toString().charAt(0) || '') +
        (this.user?.name?.lastname.toUpperCase().toString().charAt(0) || '');
      this.title = this.translateService.instant('HEADER.LOGOUT');
    } else {
      this.title = this.translateService.instant('HEADER.LOGIN');
      this.isAuthenticated = false;

    }
  }

  updateItemLanguage() {
    this.items = [
      {
        label: this.translateService.instant('HEADER.HOME'),
        icon: 'pi pi-home',
      },
      {
        label: this.translateService.instant('HEADER.WOMEN'),
        icon: 'pi pi-shop',
      },
      {
        label: this.translateService.instant('HEADER.MEN'),
        icon: 'pi pi-shop',
      },
      {
        label: this.translateService.instant('HEADER.CATEGORY'),
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: this.translateService.instant('HEADER.ELECTRONICS'),
            icon: 'pi pi-bolt',
          },
          {
            label: this.translateService.instant('HEADER.JEWELRY'),
            icon: 'pi pi-server',
          },
          {
            label: this.translateService.instant('HEADER.MEN_CLOTHING'),
            icon: 'pi pi-pencil',
          },
          {
            label: this.translateService.instant('HEADER.WOMEN_CLOTHING'),
            icon: 'pi pi-palette',
          },
        ],
      },
      {
        label: this.translateService.instant('HEADER.PRODUCTS'),
        icon: 'pi pi-shop',
      },
      {
        label: this.translateService.instant('HEADER.CONTACT'),
        icon: 'pi pi-envelope',
      },
    ];
    if (this.isAuthenticated) {
      this.title = this.translateService.instant('HEADER.LOGOUT');
    } else {
      this.title = this.translateService.instant('HEADER.LOGIN');
    }

  }

  toggleAuthentication() {

    if (this.isAuthenticated === false) {
      this.route.navigate([ '/auth/login' ]);
    } else {
      this.authService.logout();
      this.isAuthenticated = false;
      this.title = this.translateService.instant('HEADER.LOGIN');
    }
  }
}
