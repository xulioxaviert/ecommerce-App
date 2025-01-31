import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UsersService } from '../../users/users.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  //declaración de variables de pruebas
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  //configuración y declaración de módulos, servicios y providers
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        UsersService
      ],
      //recomendado para evitar errores de elementos desconocidos
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    });
  });
  //instanciar el componente y extraer el componente
  beforeEach(() => {
    //extraer el componente
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    //el componente comienza por el ciclo de vida ngOnInit
    fixture.detectChanges();
  })
  //hacer el test mas sencillo, comprobar que el componente se crea
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
