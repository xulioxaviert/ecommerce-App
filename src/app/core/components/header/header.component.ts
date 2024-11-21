import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
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
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';

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
    ReactiveFormsModule, ToggleButtonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  changeLanguage = input();
  lang = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'en';

  categories = signal<string[]>([]);
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();
  items: MenuItem[] | undefined;

  formGroup!: FormGroup;
  isAuthenticated: boolean = false;
  toggleButtonText: string = '';


  constructor(private translateService: TranslateService, private route: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.updateItemLanguage();
    this.createForm();
    this.checkAuthenticated();

  }

  createForm() {
    this.formGroup = new FormGroup({
      checked: new FormControl<boolean>(false)
    });
    this.formControlValueChanged();

  }

  formControlValueChanged() {
    this.formGroup.get('checked')?.valueChanges.subscribe((checked) => {
      if (checked === true) {
        this.toggleButtonText = this.translateService.instant('HEADER.LOGOUT');
        this.logout();
      } else {
        this.toggleButtonText = this.translateService.instant('HEADER.LOGIN');
        this.route.navigate([ '/auth/login' ]);
      }
    });
  }
  checkAuthenticated() {

    if (!this.authService.isAuthenticated()) {
      this.toggleButtonText = this.translateService.instant('HEADER.LOGIN');

    } else {
      this.toggleButtonText = this.translateService.instant('HEADER.LOGOUT');
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
  }
  changeLabelLanguage(changeLanguage: any) {
    this.translateService.onLangChange.pipe(take(1)).subscribe((event) => {
      this.updateItemLanguage();
    });
    this.translateService.setDefaultLang(changeLanguage);
  }
  toggleAuthentication() {
    if (this.authService.isAuthenticated()) {
      this.logout();
      this.toggleButtonText = this.translateService.instant('HEADER.LOGIN');
    } else {
      this.route.navigate([ '/auth/login' ]);
    }

  }
  logout() {
    this.authService.logout();
  }
}
