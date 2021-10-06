import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [],
  imports: [CommonModule, ModalModule.forRoot(), AlertModule.forRoot()],
  exports: [CommonModule, ModalModule, AlertModule]
})
export class NgxBootstrapModule {}
