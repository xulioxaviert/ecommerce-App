import { CommonModule, NgClass, NgIf } from '@angular/common';
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
    ReactiveFormsModule, ToggleButtonModule,
    RouterModule,
    NgClass,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  changeLanguage = input();
  
  categories = signal<string[]>([]);
  isAuthenticated: boolean = false;
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();

  items: MenuItem[] | undefined;

  formGroup!: FormGroup;
  toggleButtonText: string = '';
  tanslateService$: TranslateService;
  user: Users | undefined;


  constructor(private translateService: TranslateService, private route: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.updateItemLanguage();
    this.createForm();
    this.checkAuthenticated();
    this.isAuthenticated$ = this.authService.isAuthenticated$;

  }

  createForm() {
    this.formGroup = new FormGroup({
      checked: new FormControl<boolean>(false)
    });
    this.formControlValueChanged();
  }

  formControlValueChanged() {
    this.formGroup.get('checked')?.valueChanges.subscribe((checked) => {
      console.log("this.formGroup.get / checked:", checked);
      if (checked === true) {
        this.toggleButtonText = this.translateService.instant('HEADER.LOGOUT');
      } else {
        this.route.navigate([ '/auth/login' ]);
        this.toggleButtonText = this.translateService.instant('HEADER.LOGIN');
      }
    });
  }
  checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.toggleButtonText = this.translateService.instant('HEADER.LOGOUT');
      this.user = this.authService.getSessionStorage('user')
      console.log("checkAuthenticated / this.user:", this.user);

    } else {
      this.toggleButtonText = this.translateService.instant('HEADER.LOGIN');

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
      this.checkAuthenticated();

    });

  }
  toggleAuthentication() {
    if (!this.authService.isAuthenticated()) {
      this.route.navigate([ '/auth/login' ]);
    } else {
      this.authService.logout();
      this.isAuthenticated = false;
    }
  }


}
