import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ENDPOINTS } from '../../core/const/constants';
import { CategoryFake } from '../../core/models/products.model';
import { HttpService } from '../../core/services/http.service';


@Component({
  selector: 'app-team',
  standalone: true,
  imports: [ NgForOf, TranslateModule ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  categories: CategoryFake[] = [];

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.getData(ENDPOINTS.getAllCategories).subscribe((categories) => {
      console.log(categories);
      this.categories = [ {
        category: 'electronics',
        name: 'electronics',
        title: 'tecnología que simplifica tu vida',
        descriptions:
          'Lo último en gadgets y dispositivos electrónicos para mantenerte conectado, productivo y entretenido. Desde lo esencial hasta lo más innovador, encuentra justo lo que necesitas para tu mundo digital.',
      },
      {
        category: 'JEWELRY',
        name: 'jewellery',
        title: 'Brilla con Estilo: Joyería para Cada Momento',
        descriptions:
          'Encuentra piezas únicas que hablan por ti. Desde diseños elegantes hasta toques modernos, nuestra colección de joyería es perfecta para destacar en cualquier ocasión. Porque cada detalle cuenta, ¡hazlo inolvidable!',
      },
      {
        category: 'MEN',
        name: 'men',
        title: 'Estilo Masculino: Hecho a Tu Medida',
        descriptions:
          'Moderno, cómodo y siempre a la moda. Descubre nuestra colección para hombres que buscan prendas versátiles, con un diseño que combina funcionalidad y actitud. ¡El look que necesitas está aquí!',
      },
      {
        category: 'WOMEN',
        name: 'women',
        title: 'Moda Femenina: Vive tu Mejor Versión',
        descriptions:
          'Diseños que inspiran confianza y estilo. Desde básicos imprescindibles hasta piezas que marcan tendencia, explora nuestra selección para realzar tu esencia en cada paso que des.',
      },
      {
        category: 'MEN',
        name: 'men',
        title: 'Estilo Masculino: Hecho a Tu Medida',
        descriptions:
          'Moderno, cómodo y siempre a la moda. Descubre nuestra colección para hombres que buscan prendas versátiles, con un diseño que combina funcionalidad y actitud. ¡El look que necesitas está aquí!',
      },
      {
        category: 'WOMEN',
        name: 'women',
        title: 'Moda Femenina: Vive tu Mejor Versión',
        descriptions:
          'Diseños que inspiran confianza y estilo. Desde básicos imprescindibles hasta piezas que marcan tendencia, explora nuestra selección para realzar tu esencia en cada paso que des.',
      } ]
    });
  }
}
