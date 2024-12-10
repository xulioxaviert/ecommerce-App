import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';


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
        loadChildren: () => import('./electronics/electronics.component').then(m => m.ElectronicsComponent)

      },
      {
        path: 'jewelry',
        loadChildren: () => import('./jewelry/jewelry.component').then(m => m.JewelryComponent)
      },
      {
        path: 'mens',
        loadChildren: () => import('./mens/mens.component').then(m => m.MensComponent)
      },
      {
        path: 'women',
        loadChildren: () => import('./women/women.component').then(m => m.WomenComponent)
      },
    ],
  }

]

