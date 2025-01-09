import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'men',
  },
  {
    path: '',
    component: CategoriesComponent,
    children: [
      
      {
        path: 'electronics',
        loadComponent: () => import('./electronics/electronics.component').then(m => m.ElectronicsComponent),
      },
      {
        path: 'jewelry',
        loadComponent: () => import('./jewelry/jewelry.component').then(m => m.JewelryComponent)
      },
      {
        path: 'men',
        loadComponent: () => import('./men/men.component').then(m => m.MenComponent)
      },
      {
        path: 'women',
        loadComponent: () => import('./women/women.component').then(m => m.WomenComponent)
      },
      {
        path: 'feature',
        loadComponent: () => import('./feature/feature.component').then(m => m.FeatureComponent)
      }
    ],
  }

]

