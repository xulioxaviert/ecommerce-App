import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './core/services/loading.service';
import { CoreModule } from './core/core.module';
import { ToastModule } from 'primeng/toast';
import { TranslateService } from '@ngx-translate/core';


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
   lang = localStorage.getItem('language')
    ? localStorage.getItem('language')
    : 'en';

  constructor(private loadingService: LoadingService, private translateService: TranslateService) {
    this.isLoading$ = this.loadingService.isLoading$
    this.translateService.setDefaultLang(this.lang || '');

  }
  ngOnInit(): void {
    // this.loadingService.isLoading$.next(false)
  }
}
