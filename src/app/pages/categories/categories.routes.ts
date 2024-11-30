import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { JewelryComponent } from './jewelry/jewelry.component';
import { MensComponent } from './mens/mens.component';
import { WomenComponent } from './women/women.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'electronics',
  },
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'electronics',
        component: ElectronicsComponent

      },
      {
        path: 'jewelry',
        component: JewelryComponent
      },
      {
        path: 'mens',
        component: MensComponent
      },
      {
        path: 'women',
        component: WomenComponent
      },
    ],
  }

]

