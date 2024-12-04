import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { CoreModule } from './core/core.module';
import { LoadingService } from './core/services/loading.service';
import { HeaderComponent } from './core/components/header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, AsyncPipe, ProgressSpinnerModule, CoreModule, ToastModule, HeaderComponent, TranslateModule ],
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
      ? localStorage.getItem('language') || 'en'
      : 'en';

    this.translateService.use(lang);

  }
}
