import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-electronics',
  standalone: true,
  imports: [ NgForOf, TranslateModule, RouterOutlet ],
  templateUrl: './electronics.component.html',
  styleUrl: './electronics.component.scss',
})
export class ElectronicsComponent implements OnInit {

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
