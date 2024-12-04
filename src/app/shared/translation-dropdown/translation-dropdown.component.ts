import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
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
  selectedLanguage: any;
  languages: DropdownLanguages[] = [
    { name: 'Español', code: 'es' },
    { name: 'English', code: 'en' },
    { name: 'Français', code: 'fr' },
  ];



  constructor(
    private translateService: TranslateService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {

  }
  ngOnInit(): void {
    this.loadData();

  }


  loadData() {
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'en') {
      this.selectedLanguage = this.languages[ 1 ];
    } else if (lang === 'es') {
      this.selectedLanguage = this.languages[ 0 ];
    } else {
      this.selectedLanguage = this.languages[ 2 ];
    }
  }
  //TODO: Revisar con Mario
  chooseLanguage() {
    // this.languageForm.get('language')?.valueChanges.subscribe((value) => {
    //   this.selectedLanguage = value;
    //   console.log('chooseLanguage / event:', value);
    //   this.translateService.use(value.code);
    //   this.translateService.setDefaultLang(value.code);
    //   localStorage.setItem('language', value.code);
    // });
  }

  changeLanguage(event: DropdownChangeEvent) {
    this.selectedLanguage = event.value;
    console.log("changeLanguage / event:", event);
    this.translateService.use(event.value.code);

  }
}
