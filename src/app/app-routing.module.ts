import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PagesRoutes } from './pages';
import { HomepageNoAuthComponent } from './pages/homepageNoAuth/homepageNoAuth.component';
import { MapSelectComponent } from './pages/map-select/map-select.component';

const routes: Routes = [
  {
    path: 'hp',
    component: LayoutComponent,
    children: [
      {
        path: 'Homepage',
        component: HomepageNoAuthComponent,
        data: { title: 'Homepage' },
      },
      ...PagesRoutes,
      {
        path: '',
        pathMatch: 'full',
        component: HomepageNoAuthComponent,
        data: { title: 'Homepage' },
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'hp/Homepage',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
