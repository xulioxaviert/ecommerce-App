import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../core/models/cart.model';
import { ModalService } from './modal-service.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ DialogModule, UpperCasePipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
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
