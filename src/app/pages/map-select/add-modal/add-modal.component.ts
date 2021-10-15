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
  fakeImg: any;
  imgFile: any;

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

  ngOnInit(): void { this.addMapForm.controls.imageUrl.setValue('some error'); }

  createForm() {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  addMap() {
    if(this.addMapForm.invalid || !this.imgFile) {
      return;
    }
    // tries to upload image to our storage once the user has actually decided to add the map
    this.cloudStorage.uploadToUsersImages(this.imgFile).then(url => {
      url.subscribe(imageUrl => {
        this.addMapForm.controls.imageUrl.setValue(imageUrl);
        this.userMapService.updateUserMap(this.addMapForm.value);
        this.modalRef.hide();
      });
    })
  }

  processImage(event: any) {
    this.imgFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = data => {
      this.fakeImg = data.target?.result;
    }
  }

  test() {
    console.log('test');
  }

  test2() {
    console.log('test2');
  }
}
