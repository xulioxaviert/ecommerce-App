import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([ { path: '', component: AuthenticationComponent } ]),
    LoginComponent,
    RegisterComponent,
    AuthenticationComponent
  ]
})
export class AuthenticationModule { }
