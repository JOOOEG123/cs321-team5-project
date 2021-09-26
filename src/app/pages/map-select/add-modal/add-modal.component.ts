import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '@core/services/firebase/firebase.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DB_CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss']
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
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  createForm() {
    return this.fb.group(
      {
        name: ['', Validators.required],
        description: ['', Validators.required],
        imageUrl: ['', Validators.required],
      }
    );
  }

  addMap() {
    this.firebaseService.saveEntry(this.signInForm.value, DB_CONFIG.map_endpoint).then(data => {
      console.log('successful save',data);
      this.modalRef.hide();
    }).catch(err => {
      throw err;
    })
  }

}
