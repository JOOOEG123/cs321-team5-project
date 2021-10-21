import { Injectable, TemplateRef } from '@angular/core';
import { PinUpdate, Pin } from '@shared/map-tracker/map-tracker.model';
import { PinModalComponent } from '@shared/map-tracker/pin-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackImgService {
  private modals: any[] = [];
  private listeners: Array<Subject<any>> = [];
  private i = 0;

  private currentPin?: string;
  private modalRef?: Map<string, BsModalRef> = new Map<string, BsModalRef>();

  private currentPinUpdate?: PinUpdate;

  constructor(private modalService: BsModalService) {}
  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  addListener(listener: Subject<any>) {
    this.listeners.push(listener);
  }

  removeListener(listener: Subject<any>) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  fireUpdate(textUpdate: PinUpdate) {
    this.listeners.forEach((nextListener) => {
      nextListener.next(textUpdate);
    });
  }

  closeModal(id?: string) {
    // remove modal from array of active modals
    const modal: PinModalComponent = this.modals.find((x) => x.id !== id);
    if (modal) {
      // modal.remove()
    }
    console.log(this.currentPin);
    if (this.currentPin) {
      this.modalRef?.get(this.currentPin)?.hide();
    } else {
      this.modalService.hide();
    }
  }

  open(id: string, pin: Pin, template: TemplateRef<any>) {
    // open modal specified by id
    console.log(pin.id);
    this.currentPin = pin.id;
    this.currentPinUpdate = {
      id: pin.id,
      header: pin.header,
      text: pin.text,
    };
    const mRef = this.modalService.show(template, {
      id: this.i,
      class: 'modal-lg',
    });
    this.modalRef?.set(pin.id, mRef);
    // const modal : PinModalComponent = this.modals.find(x => x.id === id);
    // if (modal) {
    //   modal.open(pin.id, text);
    // }
  }

  close(id: string, text: string = '') {
    // close modal specified by id
    const modal: PinModalComponent = this.modals.find((x) => x.id === id);
    if (modal) {
      // modal.save();
    }
  }

  // close modal
  save(form:any): void {
    console.log(form);
    if (this.currentPinUpdate) {
      this.currentPinUpdate['header'] = form.header;
      this.currentPinUpdate['text'] = form.text;
      this.fireUpdate(this.currentPinUpdate);
      console.log(this.currentPinUpdate);
    }
    this.listeners.forEach((nextListener) => {
      nextListener.subscribe(x=> {
        console.log(x)
      }).unsubscribe();
    })
    this.closeModal();
  }

  removeContent(): void {
    if (this.currentPinUpdate) {
      this.currentPinUpdate.header = undefined;
      this.fireUpdate(this.currentPinUpdate);
    }
  }
}
