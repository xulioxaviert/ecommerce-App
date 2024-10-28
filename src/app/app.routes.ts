import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/products/products-detail/products-detail.component').then(m => m.ProductsDetailComponent),
  },


];
