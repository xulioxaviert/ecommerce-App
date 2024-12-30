import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
// Removed duplicate and incorrect import
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Observable, Subscription } from 'rxjs';
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
    ConfirmPopupModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories = signal<string[]>([]);
  isAuthenticated: boolean = false;
  isAuthenticated$: Observable<boolean>;

  items: MenuItem[] | undefined;

  formGroup!: FormGroup;
  user: Users | undefined;
  initialsName: string = '';
  title: string = '';
  isVisible: boolean = true;
  subscription = new Subscription();

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.checkAuthenticated();
    this.getSubscriptions();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getSessionStorage('user');
      this.initialsName =
        (this.user?.name?.firstname.toUpperCase().toString().charAt(0) || '') +
        (this.user?.name?.lastname.toUpperCase().toString().charAt(0) || '');
      this.isAuthenticated = true;
      console.log('checkAuthenticated / this.initialsName:', this.initialsName);
    }
    this.updateItemLanguage();
  }

  getSubscriptions() {
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe((response) => {
        console.log(
          'this.authService.isAuthenticated$.subscribe / response:',
          response
        );
        this.isAuthenticated = response;
        this.updateItemLanguage();

      })
    );

    this.subscription.add(this.translateService.onLangChange.subscribe(() => {
      this.updateItemLanguage();
    }))

    this.subscription.add(
      this.authService.user$.subscribe((response) => {
        console.log("this.authService.user$.subscribe / response:", response);
        if (Object.keys(response).length !== 0) {
          this.user = response;
          this.initialsName =
            (this.user?.name?.firstname.toUpperCase().toString().charAt(0) || '') +
            (this.user?.name?.lastname.toUpperCase().toString().charAt(0) || '');
          console.log(
            'this.authService.user$.subscribe / this.initialsName:',
            this.initialsName
          );
        }
      })
    );

  }

  updateItemLanguage() {
    if (!this.authService.isAuthenticated()) {
      this.title = this.translateService.instant('HEADER.LOGIN');
    } else {
      this.title = this.translateService.instant('HEADER.LOGOUT');
    }
    if (this.isAuthenticated && this.user?.role === 'admin') {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }

    this.items = [
      {
        label: this.translateService.instant('HEADER.HOME'),
        icon: 'pi pi-home',
        visible: true,
        // route: '/',
        command: () => {
          this.router.navigate([ '/' ]);
        },
      },
      {
        label: this.translateService.instant('HEADER.NEW_ARRIVALS'),
        icon: 'pi pi-shop',
        visible: true,
        route: '/categories/feature',
      },
      {
        label: this.translateService.instant('HEADER.FEATURED'),
        icon: 'pi pi-shop',
        visible: true,
        command: () => {
          this.router.navigate([ '/categories/feature' ]);
        },
      },
      {
        label: this.translateService.instant('HEADER.OUTLET'),
        icon: 'pi pi-shop',
        visible: true,
        command: () => {
          this.router.navigate([ '/category/featured' ]);
        },
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
            route: '/categories/men',
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
        label: this.translateService.instant('HEADER.DASHBOARD'),
        icon: 'pi pi-shop',
        visible: this.isVisible,
        route: '/dashboard',
      },
    ];
  }

  toggleAuthentication(event: Event) {
    console.log("toggleAuthentication / event:", event);
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([ '/auth/login' ]);
    } else {
      // this.authService.logout();
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Estás seguro que deseas cerrar sesión?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.authService.logout();
          this.isAuthenticated = false;
          this.initialsName = '';
          this.title = this.translateService.instant('HEADER.LOGIN');
          if (this.router.url === '/dashboard') {
            this.router.navigate([ '/' ]);
          }
        },
        reject: () => {

        }
      });

    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
