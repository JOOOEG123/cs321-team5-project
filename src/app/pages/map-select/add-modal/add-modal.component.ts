import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CloudStorageService } from '@core/services/cloud-storage/cloud-storage.service';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  addMapForm = this.createForm();
  showImageAdd = true;

  formConst = [
    {
      formControl: 'name',
      placeholder: 'Map Name',
      type: 'text'
    },
    {
      formControl: 'description',
      placeholder: 'Description',
      type: 'text'
    },
    {
      formControl: 'imageUrl',
      placeholder: 'Image',
      type: 'image'
    },
  ];

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private userMapService: UserMapService,
    private cloudStorage: CloudStorageService
  ) {}

  ngOnInit(): void {}

  createForm() {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  addMap() {
    if(this.addMapForm.invalid) {
      return;
    }
    this.userMapService.updateUserMap(this.addMapForm.value);
    this.modalRef.hide();
  }

  processImage(event: any) {
    this.cloudStorage.uploadToUsersImages(event.target.files[0]).then(url => {
      url.subscribe(imageUrl => {
        this.addMapForm.controls.imageUrl.setValue(imageUrl);
        this.showImageAdd = false;
      });
    })

  }

  test() {
    console.log('test');
  }

  test2() {
    console.log('test2');
  }
}
