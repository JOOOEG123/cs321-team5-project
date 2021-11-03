import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    CarouselModule.forRoot(),
  ],
  exports: [CommonModule, ModalModule, AlertModule, CarouselModule],
})
export class NgxBootstrapModule {}
