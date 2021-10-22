import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PinInformation } from '@core/models/map-tracker.model';
import { DndMap } from '@core/models/map.model';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  map= {
    imageUrl: '../../../assets/images/dashboard/newmap.jpg',
  } as DndMap;

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

  constructor(
    private mapService: UserMapService,
    private router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.router.params.pipe(take(1)).subscribe(params => {
      if(params.id) {
        this.getMap(params.id).then(map => {
          if(map) {
            this.map = map;
          }
        });
      }
    })
  }

  async getMap(id: string) {
    try {
      const allUserMap = await this.mapService.getAllUserMaps();
      if (allUserMap) {
        const { user_maps } = allUserMap;
        return user_maps.find((map:DndMap) => map.id === id) as DndMap;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}
