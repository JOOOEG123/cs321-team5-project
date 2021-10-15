import { Component, OnInit } from '@angular/core';
import { DndMap } from '@core/models/auth/map.model';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddModalComponent } from './add-modal/add-modal.component';

@Component({
  selector: 'app-map-select',
  templateUrl: './map-select.component.html',
  styleUrls: ['./map-select.component.scss'],
})
export class MapSelectComponent implements OnInit {
  maps = [] as DndMap[];
  addMapModal?: BsModalRef;
  uid: string | undefined;
  userMaps: any;

  constructor(
    private modalService: BsModalService,
    private userMapService: UserMapService
  ) {
    this.userMapService.getAllUserMaps();
  }

  ngOnInit(): void {
    this.userMapService.userMap.subscribe((userMap) => {
      this.maps = userMap;
    });
    this.newMap();
  }

  clicked(map: DndMap) {
    this.userMapService.updateUserMap(map);
  }

  newMap() {
    this.addMapModal = this.modalService.show(AddModalComponent, {class: 'modal-lg'});
  }
  deleteMap(index:number){
    this.userMapService.deleteUserMap(index);
  }
}
