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
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.routes').then(m => m.routes),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/products/products-detail/products-detail.component').then(m => m.ProductsDetailComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },


];
