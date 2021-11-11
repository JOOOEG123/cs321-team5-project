
import { SlicePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { uuidv4 } from '@core/helper';
import { TrackImgService } from '@core/services/track-img/track-img.service';
import {
  Direction,
  Pin,
  PinInformation,
  Size,
} from '../../core/models/map-tracker.model';

@Component({
  selector: 'app-map-tracker',
  templateUrl: './map-tracker.component.html',
})
export class MapTrackerComponent implements AfterViewInit {
  private clickReceived: boolean = false;
  private currentId!: string;
  private hasSelected: boolean = false;
  private pins: Map<string, any> = new Map<string, any>();

  cloudUrl: any;
  currentIndex: any;
  modalHeader: string = 'Add';
  pinForm: FormGroup = this.createPinForm();

  @Input() pinInformation: PinInformation = new PinInformation();
  @Output() pinInformationChange: EventEmitter<PinInformation> =
    new EventEmitter<PinInformation>();
  @Input() pinType = ''
  @ViewChild('imageel') imageel: any;
  @ViewChild('template') template: TemplateRef<any> | undefined;
  saveState: string = '';
  currentPinId: string = '';

  constructor(
    private modalService: TrackImgService,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    this.renderAll();
  }

  renderAll(pinInformation?:PinInformation | undefined, render?:any) {
    if(pinInformation) {
      this.renderer = render;
      this.pinInformation = pinInformation;
    }
    this.renderImage();
    this.renderPins();
  }

  createPinForm() {
    return this.fb.group({
      header: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  private async renderImage() {
    this.renderer.setAttribute(
      this.imageel.nativeElement,
      'style',
      "position: relative;background-image: url('" +
        this.pinInformation.imageLocation +
        "');" +
        'background-size: ' +
        this.pinInformation.imageXSize +
        'px ' +
        this.pinInformation.imageYSize +
        'px;' +
        'width: ' +
        this.pinInformation.imageXSize +
        'px;height : ' +
        this.pinInformation.imageYSize +
        'px;'
    );
  }

  private renderPins() {
    if (this.pinInformation.pins.length > 0) {
      let vm = this;
      this.pinInformation.pins.forEach((nextPin: Pin) => {
        vm.addAPin(vm, nextPin);
      });
      this.saveState = 'edit';
    }
  }

  private addAPin(vm: MapTrackerComponent, nextPin: Pin): string {
    let spanArea = this.renderer.createElement('small');
    if (nextPin.header) {
      let spanCaption = this.renderer.createElement('small');
      vm.renderer.setAttribute(spanCaption, 'class', 'popover-box');
      const k = new SlicePipe().transform(nextPin.header, 0, 10)+(nextPin.header && nextPin.header.length >= 10 ? '...' : '') ;
      vm.renderer.setProperty(spanCaption, 'innerHTML', k);
      vm.renderer.appendChild(spanArea, spanCaption);
    }

    nextPin.id = uuidv4('tracker');
    vm.renderer.setAttribute(spanArea, 'id', nextPin.id);
    vm.renderer.setAttribute(spanArea, 'class', 'pin');
    vm.renderer.setAttribute(spanArea, 'style', this.stylePin(nextPin));
    vm.renderer.appendChild(this.imageel.nativeElement, spanArea);
    vm.pins.set(nextPin.id, spanArea);
    return nextPin.id;
  }

  onClosedModal() {
    const findPin = this.pinInformation.pins.find(
      (item) => item.id === this.currentPinId
    );
    if(findPin && (!findPin.header || !findPin.text)){
      this.removePin(this, findPin);
    }
    this.saveState = 'close';
    this.modalService.closeModal();
  }

  private stylePin(nextPin: Pin): string {
    let style: string =
      `background-image: url(${nextPin.imgUrl || this.pinType});`  +
      'cursor:grab;position:absolute;top:' +
      nextPin.ycoords +
      'px;left:' +
      nextPin.xcoords +
      'px;';
    switch (nextPin.size) {
      case Size.Large:
        style += 'width: 64px;height: 64px;background-size: 64px 64px;';
        break;
      case Size.Medium:
        style += 'width: 32px;height: 32px;background-size: 32px 32px;';
        break;
      case Size.Small:
        style += 'width: 16px;height: 16px;background-size: 16px 16px;';
        break;
    }
    return style;
  }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    let targetElement = event.target;
    if (event.target.classList.contains('popover-box')) {
      targetElement = targetElement.parentNode;
    }
    let id: string = targetElement.id;

    if (!this.template) return;
    if (this.pins.has(id) && !this.hasSelected) {
      this.clickReceived = true;
      let pin: Pin | any = this.pinInformation.pins.find(
        (item) => item.id === id
      );
      this.currentIndex = this.pinInformation.pins.findIndex(
        (item) => item.id === id
      );
      this.currentPinId = id;
      this.modalHeader = 'Edit';
      this.saveState = 'edit';
      this.pinForm.patchValue(pin);
      this.modalService.open(this.template);
    } else if (!this.pins.has(id) && !this.hasSelected) {
      this.currentIndex = this.pinInformation.pins.length;
      let pin: Pin = <Pin>{};
      pin.xcoords = event.offsetX;
      pin.ycoords = event.offsetY;
      pin.direction = Direction.Down;
      pin.size = Size.Medium;
      pin.header = 'New Pin';
      this.saveState = '';
      pin.text = undefined;
      pin.imgUrl = this.pinType;
      this.pinInformation.pins.push(pin);
      this.currentPinId = this.addAPin(this, pin);
      this.modalHeader = 'Add';
      this.pinForm.patchValue(pin);
      this.modalService.open(this.template);
    }
    console.log("H-", this.saveState)
    if(this.saveState && !['close'].includes(this.saveState)) {
      this.pinInformationChange.emit(this.pinInformation);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any) {
    this.currentId = event.target.id;
    if (this.pins.has(this.currentId)) {
      let vm = this;
      setTimeout(() => {
        vm.hasSelected = true;
      }, 10);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any) {
    let vm: any = this;
    setTimeout(() => {
      vm.hasSelected = false;
      vm.currentId = null;
      vm.clickReceived = true;
    }, 20);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: any) {
    if (this.hasSelected && this.currentId) {
      let thisPin: any = this.pins.get(this.currentId);
      let pinInformation: Pin | undefined = this.pinInformation.pins.find(
        (item) => item.id === this.currentId
      );
      if (thisPin && pinInformation) {
        pinInformation.xcoords = pinInformation.xcoords + event.movementX;
        pinInformation.ycoords = pinInformation.ycoords + event.movementY;
        if (pinInformation.xcoords < -1) {
          pinInformation.xcoords = 0;
        }
        if (this.pinInformation.imageXSize < pinInformation.xcoords) {
          pinInformation.xcoords = this.pinInformation.imageXSize;
        }
        if (pinInformation.ycoords < -1) {
          pinInformation.ycoords = 0;
        }
        if (this.pinInformation.imageYSize < pinInformation.ycoords) {
          pinInformation.ycoords = this.pinInformation.imageYSize;
        }
        this.renderer.setAttribute(
          thisPin,
          'style',
          this.stylePin(pinInformation)
        );
      }
    }
  }

  save() {
    this.saveState = 'save';
    const current = this.pinInformation.pins[this.currentIndex];
    const { header, text } = this.pinForm.value;
    current['header'] = header;
    current.text = text;
    this.editPin(this, current);
    this.modalService.closeModal();
  }

  editPin(vm: MapTrackerComponent, current: Pin) {
    this.saveState = 'edit';
    const pins = vm.pinInformation.pins;
    let index = pins.findIndex((item: { id: any }) => item.id === current.id);
    let element: any = document.getElementById(current.id);
    pins[index].header = current.header;
    const k = new SlicePipe().transform(current.header, 0, 10)+(current.header && current.header.length >= 10 ? '...' : '') ;
    let popOverBox = element.getElementsByClassName('popover-box')[0];
    vm.renderer.setProperty(popOverBox, 'innerHTML', k);
    vm.pins.set(current.id, element);
    vm.hasSelected = false;
    vm.clickReceived = false;
    vm.currentId = '';
    (current.header && current.text) && vm.pinInformationChange.emit(vm.pinInformation);
  }

  removePin(vm: MapTrackerComponent, current: Pin) {
    this.saveState = 'remove';
    const pins = vm.pinInformation.pins;
    let index = pins.findIndex((item: { id: any }) => item.id === current.id);
    let element: any = document.getElementById(current.id);
    element.parentElement.removeChild(element);
    vm.pinInformation.pins.splice(index, 1);
    vm.pins.delete(current.id);
    vm.hasSelected = false;
    vm.clickReceived = false;
    vm.currentId = '';
    vm.pinInformationChange.emit(vm.pinInformation);
  }

  delete() {
    this.saveState = 'delete';
    const current = this.pinInformation.pins[this.currentIndex];
    this.removePin(this, current);
    this.modalService.closeModal();
  }
}
