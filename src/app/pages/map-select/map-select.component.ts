import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DndMap } from '@core/models/map.model';
import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { PinInformation } from '@core/models/map-tracker.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddModalComponent } from './add-modal/add-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

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
  modalRef: BsModalRef | undefined;
  deleteIndex: number = 0;

  constructor(
    private modalService: BsModalService,
    private userMapService: UserMapService,
    private cloudStorage: CloudStorageService,
    private spinner: NgxSpinnerService
  ) {
    this.userMapService.getAllUserMaps();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.userMapService.userMap.subscribe(
      (userMap) => {
        this.maps = userMap;
        this.getImages();
        this.hideSpinner();
      },
      (error) => {
        console.error(error);
        this.hideSpinner();
      }
    );
  }

  openDetModal(template: TemplateRef<any>, indexDel: number) {
    this.deleteIndex = indexDel;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  /**
   * gets images, should probably only do the new ones. Map images can not be edited
   */
  getImages() {
    this.maps.forEach((map) => {
      if (map.imageRef) {
        this.cloudStorage.getImageFromRef(map.imageRef).subscribe((url) => {
          map.imageUrl = url;
        });
      }
    });
  }

  hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  newMap() {
    this.addMapModal = this.modalService.show(AddModalComponent, {
      class: 'modal-lg',
    });
  }
  deleteMap() {
    this.userMapService.deleteUserMap(this.deleteIndex);
    this.modalRef?.hide();
  }
}
