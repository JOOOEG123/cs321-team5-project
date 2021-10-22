import { Component } from '@angular/core';

@Component({
  template: `<app-header></app-header>
    <app-left-nav-btn></app-left-nav-btn>
    <app-user-nav-bar></app-user-nav-bar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>`,
})
export class LayoutComponent {}
