import { NgClass } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ NgClass ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  @Input() message: string = "";
  @Input() class: string = "";
  show = false;


  ngOnInit(): void {
    console.log(this.message);

  }


  display(message: string) {
    this.message = message;
    this.show = true;
    setTimeout(() => this.hide(), 3000);
  }

  hide() {
    this.show = false;
  }
}

