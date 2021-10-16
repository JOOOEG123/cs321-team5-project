import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: `<app-header></app-header>
    <app-user-nav-bar></app-user-nav-bar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>`,
})
export class LayoutComponent {
}
