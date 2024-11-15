import { HolaComponent } from './hola/hola.component';
import { HomeComponent } from './home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'hola',
        component: HolaComponent
      }
    ]
  }
];
