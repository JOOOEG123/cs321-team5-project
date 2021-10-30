import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root',
})
export class TrackImgService {
  private modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {}
  closeModal() {
    this.modalRef?.hide();
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }
}
