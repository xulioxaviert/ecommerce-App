import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { CoreModule } from './core/core.module';
import { LoadingService } from './core/services/loading.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, AsyncPipe, ProgressSpinnerModule, CoreModule, ToastModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ecommerce-app';
  isLoading$: Observable<boolean>

  constructor(private loadingService: LoadingService, private translateService: TranslateService) {
    this.isLoading$ = this.loadingService.isLoading$

  }
  ngOnInit(): void {
    const lang = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en';

    this.translateService.setDefaultLang(lang || '');

  }
}
