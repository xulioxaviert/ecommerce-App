import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { DropdownLanguages } from '../../models/lang.model';
import { Users } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  languages: DropdownLanguages[] = [];
  languageForm: FormGroup = new FormGroup({});
  categories = signal<string[]>([]);
  public dropDownDefaultValue: string = 'English';
  user: Users = {} as Users;
  userLogin: string = 'red';
  lang = sessionStorage.getItem('language')
    ? sessionStorage.getItem('language')
    : 'en';
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();
  selectedLanguage: any | undefined;
  items: MenuItem[] | undefined;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private http: HttpService,
    private authService: AuthService
  ) {
    this.translateService.setDefaultLang(this.lang || '');
  }

  ngOnInit() {
    this.languages = [
      { name: 'Español', code: 'es' },
      { name: 'English', code: 'en' },
      { name: 'Français', code: 'fr' },
    ];
    this.createForm();
    this.loadData();
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'Features',
        icon: 'pi pi-star'
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Components',
            icon: 'pi pi-bolt'
          },
          {
            label: 'Blocks',
            icon: 'pi pi-server'
          },
          {
            label: 'UI Kit',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Templates',
            icon: 'pi pi-palette',
            items: [
              {
                label: 'Apollo',
                icon: 'pi pi-palette'
              },
              {
                label: 'Ultima',
                icon: 'pi pi-palette'
              }
            ]
          }
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope'
      }
    ]
  }


  loadData() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getSessionStorage('user');
      const lang = sessionStorage.getItem('language');
      this.translateService.setDefaultLang(lang || '');
      this.userLogin = 'green';
      this.isAuthenticated$ = this.authService.isAuthenticated$;
    }

    this.selectedLanguage = this.languages.find((language) => {
      return language.code === this.lang;
    });
  }

  createForm() {
    this.languageForm = this.fb.group({
      language: [ '', [ Validators.required ] ],
      search: [ '', [ Validators.minLength(3) ] ],
    });
    this.chooseLanguage();
  }


  chooseLanguage() {
    this.languageForm.get('language')?.valueChanges.subscribe((lang) => {
      if (lang) {
        console.log(lang.code);
        this.translateService.setDefaultLang(lang.code);
        this.authService.setSessionStorage('language', lang.code);
      }
    });
  }

  logout() {
    this.userLogin = 'red';
    this.selectedLanguage = {
      "name": "Español",
      "code": "en"
    }
    this.authService.logout();
  }
}
