import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../auth/auth.service';
import { DropdownLanguages } from '../../core/models/lang.model';

@Component({
  selector: 'app-translation-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './translation-dropdown.component.html',
  styleUrl: './translation-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationDropdownComponent implements OnInit {
  changeLanguage = output();

  selectedLanguage: any;
  languages: DropdownLanguages[] = [
    { name: 'Español', code: 'es' },
    { name: 'English', code: 'en' },
    { name: 'Français', code: 'fr' },
  ];
  languageForm: FormGroup = new FormGroup({});
  lang = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'en';
  constructor(
    private translateService: TranslateService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.translateService.setDefaultLang(this.lang || '');
  }
  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  createForm() {
    this.languageForm = this.fb.group({
      language: ['', [Validators.required]],
    });
  }
  loadData() {
    if (this.authService.isAuthenticated()) {
      const lang = sessionStorage.getItem('language');
      this.translateService.setDefaultLang(lang || '');
    } else {
      this.selectedLanguage = this.languages.find(
        (lang) => lang.code === this.lang
      );
    }
    console.log('loadData / lang:', this.lang);
  }

  chooseLanguage(event: any) {
    this.translateService.setDefaultLang(event.value.code);
    localStorage.setItem('language', event.value.code);
    this.selectedLanguage = event.value;
    this.changeLanguage.emit(event.value.code);
    console.log('chooseLanguage / event:', event.value.code);
  }
  
}
