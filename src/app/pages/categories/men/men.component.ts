import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mens',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './men.component.html',
  styleUrl: './men.component.scss',
})
export class MenComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
  ) { }
  ngOnInit(): void {
    this.getData();

  }

  getData() {

  }

  //TODO:  Revisar con Mario la traducción de las categoría si se limpia o no
  changeLabelLanguage() {
    this.getData();
  }
}
