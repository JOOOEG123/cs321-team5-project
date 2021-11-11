import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PinInformation } from '@core/models/map-tracker.model';
import { DndMap } from '@core/models/map.model';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapTrackerComponent } from '@shared/map-tracker/map-tracker.component';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  map!: DndMap;
  sub!: Subscription;

  pindata!: PinInformation;
  index!: number;
  imgUrl: any;
  pinType = './assets/images/dashboard/red-pin.png';
  allPins = [
    './assets/images/dashboard/marker.png',
    './assets/images/dashboard/red-pin.png',
    './assets/images/dashboard/pin.png',
    './assets/images/dashboard/pins.png'
  ]

  @ViewChild('imagePin') imagePin!: MapTrackerComponent;

  constructor(
    private mapService: UserMapService,
    private router: ActivatedRoute,
    private cloudst: CloudStorageService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2
  ) {}
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  async ngOnInit() {
    this.spinner.show();
    this.index = Number(this.router.snapshot.paramMap.get('id'));
    if (this.index === NaN) return;
    this.map = await this.mapService.getUserMapByIndex(this.index);
    this.imgUrl = await this.cloudst
      .getImageFromRef(this.map.imageRef)
      .toPromise();
    await this.spinner.hide();
    this.pindata = {
      imageLocation: this.imgUrl,
      imageXSize: this.map.resolX || 500,
      imageYSize: this.map.resolY || 400,
      pins: this.map.pins || [],
    };
  }

  onChangeImageSize(size: string) {
    switch (size) {
      case 'small':
        this.pindata.imageXSize = 500;
        this.pindata.imageYSize = 400;
        break;
      case 'medium':
        this.pindata.imageXSize = 800;
        this.pindata.imageYSize = 700;
        break;
      default:
        this.pindata.imageXSize = 1024;
        this.pindata.imageYSize = 974;
        break;
    }
    this.pindata.pins.map(x=>{
      const { xcoords, ycoords} = x;
      x.xcoords = (this.pindata.imageXSize/this.map.resolX) * xcoords;
      x.ycoords = (this.pindata.imageYSize/this.map.resolY) * ycoords;
      return x;
    })
    console.log(this.pindata)
    this.imagePin.renderAll(this.pindata, this.renderer);
    this.onChanges(this.pindata);
  }

  onChanges(event: PinInformation) {
    this.spinner.show();
    this.map.pins = event.pins;
    this.map.resolX = event.imageXSize;
    this.map.resolY = event.imageYSize;

    this.mapService.updateUserMap(this.map, this.index).finally(() => {
      this.spinner.hide();
      location.reload();
    });

  }
}
