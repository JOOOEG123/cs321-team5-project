import { Component, OnInit } from '@angular/core';
import { DndMap } from '@core/models/auth/map.model';
import { FirebaseService } from '@core/services/firebase/firebase.service';
import { DB_CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-map-select',
  templateUrl: './map-select.component.html',
  styleUrls: ['./map-select.component.scss']
})
export class MapSelectComponent implements OnInit {

  maps = [] as DndMap[];

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.getMaps();
  }

  getMaps() {
    this.firebaseService.getEntries(DB_CONFIG.map_endpoint, 'modifiedDate', true).subscribe((maps: DndMap[]) => {
      if(maps) {
        this.maps = maps;
      } else {
        const map = new DndMap();
        map.name = 'Test Map';
        map.description = 'This map is a test';
        map.imageUrl = 'https://i.redd.it/pq61m18mmzp51.jpg';
        this.maps.push(map);
      }
    });
  }

  clicked(map: DndMap) {
    console.log(map);
  }

  newMap() {
    console.log('new map clicked');
    this.firebaseService.saveEntry(this.maps[0], DB_CONFIG.map_endpoint).then(id => {
      this.maps[0].id = id;
    }).catch(err => {
      throw new err;
    })
  }

}
