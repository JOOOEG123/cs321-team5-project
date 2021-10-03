import { Component, OnInit } from '@angular/core';
import { DndMap } from '@core/models/auth/map.model';
import { FirebaseService } from '@core/services/firebase/firebase.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DB_CONFIG } from 'src/environments/environment';
import { AddModalComponent } from './add-modal/add-modal.component';

@Component({
  selector: 'app-map-select',
  templateUrl: './map-select.component.html',
  styleUrls: ['./map-select.component.scss']
})
export class MapSelectComponent implements OnInit {

  maps = [] as DndMap[];
  addMapModal?: BsModalRef;

  constructor(
    private firebaseService: FirebaseService,
    private modalService: BsModalService
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
    this.addMapModal = this.modalService.show(AddModalComponent);
  }

}
