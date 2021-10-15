import { Component, OnInit } from '@angular/core';
import { DndMap } from '@core/models/auth/map.model';
import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
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
    private userMapService: UserMapService,
    private cloudStorage: CloudStorageService
  ) {
    this.userMapService.getAllUserMaps();
  }

  ngOnInit(): void {
    this.userMapService.userMap.subscribe((userMap) => {
      this.maps = userMap;
      this.getImages();
    });
    this.newMap();
  }

  clicked(map: DndMap) {
    this.userMapService.updateUserMap(map);
  }

  getImages() {
    this.maps.forEach(map => {
      if(map.imageRef) {
        this.cloudStorage.getImageFromRef(map.imageRef).subscribe(url => {
          map.imageUrl = url;
        })
      }
    })
  }

  newMap() {
    this.addMapModal = this.modalService.show(AddModalComponent, {class: 'modal-lg'});
  }
  deleteMap(index:number){
    this.userMapService.deleteUserMap(index);
  }
}
