import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { JewelryComponent } from './jewelry/jewelry.component';
import { MenComponent } from './men/men.component';
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
        path: 'men',
        component: MenComponent
      },
      {
        path: 'women',
        component: WomenComponent
      },
    ],
  }

]

