import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DropdownLanguages } from '../../models/lang.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, DropdownModule, FormsModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  languages: DropdownLanguages[] = [];

  selectedLanguage: any | undefined;

  ngOnInit() {
    this.languages = [
      { name: 'Español', code: 'es' },
      { name: 'English', code: 'en' },
      { name: 'Français', code: 'fr' }

    ];
  }
}
