import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ENDPOINTS } from '../../const/constants';
import { DropdownLanguages } from '../../models/lang.model';
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
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  languages: DropdownLanguages[] = [];
  languageForm: FormGroup = new FormGroup({});
  categories = signal<string[]>([]);
  public dropDownDefaultValue: string = 'English';

  selectedLanguage: any | undefined;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private http: HttpService
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.languages = [
      { name: 'Español', code: 'es' },
      { name: 'English', code: 'en' },
      { name: 'Français', code: 'fr' },
    ];
    this.createForm();
  }

  loadData() {
    this.http.getData(ENDPOINTS.getAllCategories).subscribe((data) => {
      console.log(data.body);
      this.categories = data.body;
    });
    this.selectedLanguage = this.languages.find(
      (language) => language.code === this.translateService.getDefaultLang()
    );
  }

  createForm() {
    this.languageForm = this.fb.group({
      language: ['', [Validators.required]],
      search: ['', [Validators.minLength(3)]],
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
}
