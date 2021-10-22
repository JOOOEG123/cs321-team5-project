import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PinInformation } from '@core/models/map-tracker.model';
import { DndMap } from '@core/models/map.model';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  map!: DndMap;

  sub!: Subscription;

  pindata!: PinInformation ;
  index!: number;
  imgUrl: any;

  constructor(
    private mapService: UserMapService,
    private router: ActivatedRoute,
    private cloudst: CloudStorageService
  ) {}
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  async ngOnInit() {
    this.index = Number(this.router.snapshot.paramMap.get('id'));
    if (this.index === NaN) return;
    this.map = await this.mapService.getUserMapByIndex(this.index);
    console.log(this.map);
    this.imgUrl = await this.cloudst
      .getImageFromRef(this.map.imageRef)
      .toPromise();
    console.log(this.imgUrl);
    this.pindata = {
      imageLocation: this.imgUrl,
      imageXSize: 600,
      imageYSize: 900,
      pins: this.map.pins||[],
    };
  }

  onChanges(event: PinInformation) {
    console.log('Saved ', event)
    this.map.pins = event.pins;
    this.mapService.updateUserMap(this.map, this.index);
  }
}
