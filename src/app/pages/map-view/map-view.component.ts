import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PinInformation } from '@core/models/map-tracker.model';
import { DndMap } from '@core/models/map.model';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  maps:DndMap[] = [];

  sub!: Subscription;

  pindata: PinInformation = {
    imageLocation: 'R0kdawEbU1T4BAj1GbEnalSKXNy2/e1vnqcydorq',
    imageXSize: 600,
    imageYSize: 900,
    pins: [
      {
        xcoords: 328,
        ycoords: 322,
        direction: 1,
        size: 1,
        header: 'New Pin',
        text: 'fgfgfg',
        id: 'tracker514526fb-8a8b-4910-9e4f-decfaf6cf03b',
      },
    ],
  };
  index!: number;

  constructor(
    private mapService: UserMapService,
    private router: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.index = Number(this.router.snapshot.paramMap.get('id'));
    if (this.index === NaN) return;
    this.sub = this.mapService.userMap.subscribe((userMap:DndMap[]) => {
      this.maps = userMap;
      console.log(this.index)
      console.log(this.maps[this.index]);
    });
  }

  onChanges(event: any) {}
}
