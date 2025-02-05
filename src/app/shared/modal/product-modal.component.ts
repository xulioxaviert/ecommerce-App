import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../core/models/cart.model';
import { ModalService } from './product-modal-service.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ DialogModule, UpperCasePipe ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModal implements OnInit {
  @Input() currentProduct: Product;
  visible: boolean = false;


  constructor(private modalService: ModalService) { }
  ngOnInit(): void {


    this.modalService.openModal$.subscribe((product) => {

      console.log("this.modalService.openModal$.subscribe / product:", product);

      if (product && product.properties && product.properties.length > 0) {
        this.currentProduct = product;
        // this.openProductModal()
        this.visible = true;
      }
    })
  };






}
