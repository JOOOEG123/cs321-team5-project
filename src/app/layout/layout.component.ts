import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: `<app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>`,
})
export class LayoutComponent {
}
