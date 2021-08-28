import { HomepageComponent } from './pages/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'Homepage',
        component: HomepageComponent,
        data: { Title: 'Homepage' },
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'loggedIn',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
