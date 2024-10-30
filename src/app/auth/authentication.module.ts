import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([ { path: '', component: AuthenticationComponent } ]),
    LoginComponent,
    RegisterComponent,
    HttpClientModule,
    AuthenticationComponent
  ]
})
export class AuthenticationModule { }
