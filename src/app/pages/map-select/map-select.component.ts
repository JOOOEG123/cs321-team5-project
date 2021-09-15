import { Component, OnInit } from '@angular/core';
import { DndMap } from '@core/models/auth/map.model';

@Component({
  selector: 'app-map-select',
  templateUrl: './map-select.component.html',
  styleUrls: ['./map-select.component.scss']
})
export class MapSelectComponent implements OnInit {

  maps = [] as DndMap[];

  constructor() { }

  ngOnInit(): void {
    this.getMaps();
  }

  getMaps() {
    const map = new DndMap();
    map.name = 'Test Map';
    map.description = 'This map is a test';
    map.imageUrl = 'https://i.redd.it/pq61m18mmzp51.jpg';
    this.maps.push(map)
  }

}
