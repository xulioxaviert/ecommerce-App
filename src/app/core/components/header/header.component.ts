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
import { ConfirmationService, MenuItem } from 'primeng/api';
// Removed duplicate and incorrect import
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { TranslationDropdownComponent } from '../../../shared/translation-dropdown/translation-dropdown.component';
import { UsersService } from '../../../users/users.service';
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

  items: MenuItem[] | undefined;

  formGroup!: FormGroup;
  user: Users | undefined;
  initialsName: string = '';
  title: string = '';
  isVisible: boolean = false;
  subscription = new Subscription();
  productsShoppingCart: number = 0;
  favoriteProducts: number = 0;


  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.checkAuthenticated();
    this.getSubscriptions();
    this.updateItemLanguage();

  }

  checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getSessionStorage('user');
      this.initialsName =
        (this.user?.name?.firstname.toUpperCase().toString().charAt(0) || '') +
        (this.user?.name?.lastname.toUpperCase().toString().charAt(0) || '');
      this.isAuthenticated = true;
      if (this.user?.role === 'admin') {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
      this.updateItemLanguage();
      this.getData();
    } else {
      this.isAuthenticated = false;
      this.isVisible = false;
      this.productsShoppingCart = 0;
    }
  }

  getSubscriptions() {
    this.subscription.add(this.authService.isAuthenticated$.subscribe((response) => {
      this.checkAuthenticated()
    }));

    this.subscription.add(
      this.userService.shoppingCart$.subscribe((cart: any) => {
        console.log("getSubscriptions", cart.products?.length);
        this.productsShoppingCart = cart.products?.length || 0;
      })
    )



  }

  updateItemLanguage() {
    if (!this.authService.isAuthenticated()) {
      this.title = this.translateService.instant('HEADER.LOGIN');
      this.isVisible = false;
    } else {
      this.title = this.translateService.instant('HEADER.LOGOUT');
      if (this.user?.role === 'admin') {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
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
          }

        ],
      },
      {
        label: this.translateService.instant('HEADER.FAVORITES'),
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
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([ '/auth/login' ]);
    } else {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Estás seguro que deseas cerrar sesión?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.authService.logout();
          this.initialsName = '';
          this.isVisible = false;
          this.isAuthenticated = false;
          this.productsShoppingCart = 0;
          this.favoriteProducts = 0;
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

  navigateToShoppingCart() {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getSessionStorage('user');
      this.router.navigate([ `/cart/${user.userId}` ]);
    } else{
      
    }
  }

  getData() {
    const userId = this.user?.userId;
    if (userId) {
      this.userService.getShoppingCartById(userId).subscribe((cart: any) => {
        console.log("getData / cart:", cart);
        this.productsShoppingCart = cart[ 0 ].products?.length || 0;
      });
      this.userService.getFavoriteProductById(userId).subscribe((favorites: any) => {
        console.log("this.userService.getFavoriteProductById / favorites:", favorites);
        this.favoriteProducts = favorites[ 0 ].products?.length || 0;
      });

    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
