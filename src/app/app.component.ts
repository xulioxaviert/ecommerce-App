import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './core/components/header/header.component';
import { CoreModule } from './core/core.module';
import { Users } from './core/models/user.model';
import { LoadingService } from './core/services/loading.service';


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
  user: Users | undefined;
  initialsName: string = '';

  constructor(private loadingService: LoadingService, private translateService: TranslateService, private authService: AuthService) {
    this.isLoading$ = this.loadingService.isLoading$

  }
  ngOnInit(): void {
    const lang = localStorage.getItem('language')
      ? localStorage.getItem('language') || 'en'
      : 'en';

    this.translateService.use(lang);
  }


}
