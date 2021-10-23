import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PinInformation } from '@core/models/map-tracker.model';
import { DndMap } from '@core/models/map.model';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(
    private mapService: UserMapService,
    private router: ActivatedRoute,
    private cloudst: CloudStorageService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  async ngOnInit() {
    this.spinner.show();
    this.index = Number(this.router.snapshot.paramMap.get('id'));
    if (this.index === NaN) return;
    this.map = await this.mapService.getUserMapByIndex(this.index);
    console.log(this.map);
    this.imgUrl = await this.cloudst
      .getImageFromRef(this.map.imageRef)
      .toPromise();
    await this.spinner.hide();
    console.log(this.imgUrl);
    this.pindata = {
      imageLocation: this.imgUrl,
      imageXSize: 500,
      imageYSize: 400,
      pins: this.map.pins || [],
    };
  }

  onChanges(event: PinInformation) {
    this.spinner.show();
    console.log('Saved ', event);
    this.map.pins = event.pins;
    this.mapService.updateUserMap(this.map, this.index).finally(() => {
      this.spinner.hide();
    });
  }
}
