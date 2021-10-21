import { Injectable, TemplateRef } from '@angular/core';
import { PinUpdate } from '@shared/map-tracker/map-tracker.model';
import { PinModalComponent } from '@shared/map-tracker/pin-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackImgService {
  private modals: any[] = [];
  private listeners : Array<Subject<any>> = [];
  private i =0;

  private modalRef?: Map<string, BsModalRef> = new Map<string, BsModalRef>();

  constructor(private modalService: BsModalService) {}
  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  addListener(listener : Subject<any>) {
    this.listeners.push(listener);
  }

  removeListener(listener: Subject<any>) {
    this.listeners.splice(this.listeners.indexOf(listener), 1)
  }

  fireUpdate(textUpdate : PinUpdate) {
    this.listeners.forEach(nextListener => {
      nextListener.next(textUpdate);
    })
  }

  remove(id?: string) {
    // remove modal from array of active modals
    const modal : PinModalComponent = this.modals.find(x => x.id !== id);
    if (modal) {
      modal.remove()
    }

    this.modalService.hide()


  }

  open(id: string, pinId:  string, text: string = '', template: TemplateRef<any>) {
    // open modal specified by id

    const mRef = this.modalService.show(template, { id: this.i, class: 'modal-lg' });
    this.modalRef?.set(pinId, mRef);
    const modal : PinModalComponent = this.modals.find(x => x.id === id);
    if (modal) {
      modal.open(pinId, text);
    }
  }

  close(id: string, text: string = '') {
    // close modal specified by id
    const modal : PinModalComponent  = this.modals.find(x => x.id === id);
    if (modal) {
      modal.save();
    }

  }


}
