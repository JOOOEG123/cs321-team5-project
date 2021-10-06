import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserMapService } from '@core/services/user-map/user-map.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  signInForm = this.createForm();

  formConst = [
    {
      formControl: 'name',
      placeholder: 'Map Name',
    },
    {
      formControl: 'description',
      placeholder: 'Description',
    },
    {
      formControl: 'imageUrl',
      placeholder: 'Image Url',
    },
  ];

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private userMapService: UserMapService
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
    this.userMapService.updateUserMap(this.signInForm.value);
    this.modalRef.hide();
  }
}
