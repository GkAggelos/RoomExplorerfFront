import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProfileComponent } from './profile/profile.component';
import { HostComponent } from './host/host.component';
import { ResidenceComponent } from './residence/residence.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'admin',
    component: AdminComponent
  },

  {
    path: 'search',
    component: SearchResultComponent
  },

  {
    path: 'profile',
    component: ProfileComponent
  },

  {
    path: 'host',
    component: HostComponent
  },

  {
    path: 'residence',
    component: ResidenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
