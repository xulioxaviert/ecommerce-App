import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
import { HttpService } from '../../core/services/http.service';
import { TranslationDropdownComponent } from '../../shared/translation-dropdown/translation-dropdown.component';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../auth/auth.service';
import { Users } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule,
    RouterOutlet,
    ChartModule,
    MenubarModule,
    CommonModule,
    TranslationDropdownComponent,
    BadgeModule,
    AvatarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  data: any;
  options: any;
  items: MenuItem[] | undefined;
  isAuthenticated: boolean = false;
  title: string = '';
  initialsName: string = '';
  user: Users | undefined;

  constructor(
    private translateService: TranslateService,
    private http: HttpService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getData();
    this.checkAuthenticated();

    this.translateService.onDefaultLangChange.subscribe((event) => {
      // this.changeLabelLanguage();
    });


  }

  getData() {
    //get graph data
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    //navbar data(labels)
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
    ];
  }
  checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.user = this.authService.getSessionStorage('user');
      console.log('checkAuthenticated / this.user:', this.user);
      this.initialsName =
        (this.user?.name?.firstname.toUpperCase().toString().charAt(0) || '') +
        (this.user?.name?.lastname.toUpperCase().toString().charAt(0) || '');
      this.title = this.translateService.instant('HEADER.LOGOUT');
    } else {
      this.title = this.translateService.instant('HEADER.LOGIN');
      this.isAuthenticated = false;

    }
  }
  toggleAuthentication() {
    if (this.isAuthenticated === false) {
      this.router.navigate(['/auth/login']);
    } else {
      this.authService.logout();
      this.isAuthenticated = false;
      this.title = this.translateService.instant('HEADER.LOGIN');
    }
  }
}
