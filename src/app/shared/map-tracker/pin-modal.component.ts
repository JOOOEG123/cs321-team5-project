import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { TrackImgService } from '@core/services/track-img/track-img.service';

@Component({
  selector: 'app-pin-modal',
  template: ``,
})
export class PinModalComponent implements OnInit, OnDestroy {

  @Input()
  id!: string;

  @Input()
  captionText : string = '';
  pinId : string | undefined = undefined;
  private readonly element: any;

  constructor(private modalService: TrackImgService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: { target: { className: string; }; }) => {
      if (el.target.className === 'jw-modal') {
        this.save();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(id : string, captionText : string = ''): void {
    this.captionText = captionText;
    this.pinId = id;
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open');
  }

  // close modal
  save(): void {
    this.removeDialog();
    this.modalService.fireUpdate({id : this.pinId, text : this.captionText});
  }

  remove() :void {
    this.removeDialog()
    this.modalService.fireUpdate({id : this.pinId, text : ''});
  }

  private removeDialog() : void {
    this.element.style.display = 'none';
    document.body.classList.remove('jw-modal-open');
  }


}
