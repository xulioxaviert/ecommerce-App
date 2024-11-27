import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routes').then(m => m.routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/authentication.routes').then(m => m.routes),
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
    path: 'product/:id',
    loadComponent: () => import('./pages/products/products-detail/products-detail.component').then(m => m.ProductsDetailComponent),
  },


];
