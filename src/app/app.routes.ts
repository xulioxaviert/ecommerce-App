import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
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
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [ AuthGuard ]
  },


];
