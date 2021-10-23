import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-left-nav-btn',
  template: `<button
    *ngIf="isLogIn"
    class="btn py-0"
    type="button"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvas"
    aria-controls="offcanvas"
  >
    <img
      src="assets/icons/homepage/double-arrow-right.svg"
      alt="menu"
      style="display: block"
      height="20"
    />
  </button>`,
})
export class LeftNavBtnComponent implements OnInit {
  isLogIn!: boolean;
  constructor(private authfire: AngularFireAuth) {}

  ngOnInit(): void {
    this.authfire.authState.subscribe((x) => {
      this.isLogIn = x != null;
    });
  }
}
