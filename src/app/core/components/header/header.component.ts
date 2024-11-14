import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

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
  lang = (sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'en');
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();

  selectedLanguage: any | undefined;

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
  }

  loadData() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getSessionStorage('user');
      const lang = sessionStorage.getItem('language');
      this.translateService.setDefaultLang(lang || '');
      this.userLogin = 'green';
      this.isAuthenticated$ = this.authService.isAuthenticated$;

    }

    this.selectedLanguage = this.languages.find(
      (language) => language.code === this.lang
    );
  }

  createForm() {
    this.languageForm = this.fb.group({
      language: [ '', [ Validators.required ] ],
      search: [ '', [ Validators.minLength(3) ] ],
    });
    this.loadData();
    this.chooseLanguage();
  }

  chooseLanguage() {
    this.languageForm.get('language')?.valueChanges.subscribe((lang) => {
      if (lang) {
        console.log(lang.code);
        this.translateService.setDefaultLang(lang.code);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.userLogin = 'red';
    this.translateService.setDefaultLang('en');
  }

}
