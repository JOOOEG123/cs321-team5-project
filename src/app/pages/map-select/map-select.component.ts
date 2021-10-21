import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DndMap } from '@core/models/auth/map.model';
import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { PinInformation } from '@shared/map-tracker/map-tracker.model';
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


  pindata:PinInformation = {
    imageLocation: 'R0kdawEbU1T4BAj1GbEnalSKXNy2/6jn0xdhitpa',
    imageXSize: 600,
    imageYSize: 900,
    pins: [],
  };



  constructor(
    private modalService: BsModalService,
    private userMapService: UserMapService,
    private cloudStorage: CloudStorageService,
  ) {
    this.userMapService.getAllUserMaps();
  }

  ngOnInit(): void {
    this.userMapService.userMap.subscribe((userMap) => {
      this.maps = userMap;
      this.getImages();
    });
  }

  /**
   * gets images, should probably only do the new ones. Map images can not be edited
   */
  getImages() {
    this.maps.forEach(map => {
      if(map.imageRef && !map.imageUrl) {
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
