import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mens',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './mens.component.html',
  styleUrl: './mens.component.scss',
})
export class MensComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
  ) { }
  ngOnInit(): void {
    this.getData();
    this.translateService.onDefaultLangChange.subscribe((event) => {
      this.changeLabelLanguage();
    });
  }

  getData() {

  }

  //TODO:  Revisar con Mario la traducción de las categoría si se limpia o no
  changeLabelLanguage() {
    this.getData();
  }
}
