import { Injectable } from '@angular/core';
import { PinUpdate } from '@shared/map-tracker/map-tracker.model';
import { PinModalComponent } from '@shared/map-tracker/pin-modal.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackImgService {
  private modals: any[] = [];
  private listeners : Array<Subject<any>> = [];

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

  remove(id: string) {
    // remove modal from array of active modals
    const modal : PinModalComponent = this.modals.find(x => x.id !== id);
    if (modal) {
      modal.remove()
    }


  }

  open(id: string, pinId:  string, text: string = '') {
    // open modal specified by id
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
