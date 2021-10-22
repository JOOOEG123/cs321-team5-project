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
import { FormBuilder, FormGroup } from '@angular/forms';
import { uuidv4 } from '@core/helper';
import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import { TrackImgService } from '@core/services/track-img/track-img.service';
import { Direction, Pin, PinInformation, Size } from '../../core/models/map-tracker.model';

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

  @ViewChild('imageel') imageel: any;
  @ViewChild('template') template: TemplateRef<any> | undefined;

  constructor(
    private modalService: TrackImgService,
    private renderer: Renderer2,
    private cloudStorage: CloudStorageService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    this.renderImage();
    this.renderPins();
  }

  createPinForm() {
    return this.fb.group({
      header: '',
      text: '',
    });
  }

  private async renderImage() {
    this.cloudUrl = await this.cloudStorage
      .getImageFromRef(this.pinInformation.imageLocation)
      .toPromise();
    this.renderer.setAttribute(
      this.imageel.nativeElement,
      'style',
      "position: relative;background-image: url('" +
        this.cloudUrl +
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
    }
  }

  private addAPin(vm: MapTrackerComponent, nextPin: Pin): string {
    let spanArea = this.renderer.createElement('small');
    if (nextPin.header) {
      let spanCaption = this.renderer.createElement('small');
      vm.renderer.setAttribute(spanCaption, 'class', 'popover-box');
      vm.renderer.setProperty(spanCaption, 'innerHTML', nextPin.header);
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
    this.modalService.closeModal();
  }

  private stylePin(nextPin: Pin): string {
    let style: string =
      "background-image: url('./assets/images/dashboard/marker.png'); " +
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
    console.log('click');
    let targetElement = event.target;
    if (event.target.classList.contains('popover-box')) {
      targetElement = targetElement.parentNode;
    }
    let id: string = targetElement.id;

    if (!this.template) return;
    if (this.pins.has(id) && !this.hasSelected) {
      this.clickReceived = true;
      console.log('run');
      let pin: Pin | any = this.pinInformation.pins.find(
        (item) => item.id === id
      );
      this.currentIndex = this.pinInformation.pins.findIndex(
        (item) => item.id === id
      );
      this.modalHeader = 'Edit';

      console.log(pin);
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
      pin.text = undefined;
      this.pinInformation.pins.push(pin);
      this.addAPin(this, pin);
      this.modalHeader = 'Add';
      this.pinForm.patchValue(pin);
      this.modalService.open(this.template);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any) {
    this.currentId = event.target.id;
    if (this.pins.has(this.currentId)) {
      let vm = this;
      setTimeout(() => {
        vm.hasSelected = true;
      }, 200);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any) {
    let vm: any = this;
    setTimeout(() => {
      vm.hasSelected = false;
      vm.currentId = null;
      vm.clickReceived = true;
    }, 300);
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
    const current = this.pinInformation.pins[this.currentIndex];
    const { header, text } = this.pinForm.value;
    current['header'] = header;
    current.text = text;
    this.editPin(this, current);
    this.modalService.closeModal();
  }

  editPin(vm: MapTrackerComponent, current: Pin) {
    const pins = vm.pinInformation.pins;
    let index = pins.findIndex((item: { id: any }) => item.id === current.id);
    let element: any = document.getElementById(current.id);
    pins[index].header = current.header;
    let popOverBox = element.getElementsByClassName('popover-box')[0];
    vm.renderer.setProperty(popOverBox, 'innerHTML', current.header);
    vm.pins.set(current.id, element);

    vm.hasSelected = false;
    vm.clickReceived = false;
    vm.currentId = '';
    vm.pinInformationChange.emit(vm.pinInformation);
  }

  removePin(vm: MapTrackerComponent, current: Pin) {
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
    const current = this.pinInformation.pins[this.currentIndex];
    this.removePin(this, current);
    this.modalService.closeModal();
  }
}
