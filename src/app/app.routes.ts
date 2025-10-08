import { Routes } from '@angular/router';
import { HomeComponent } from './modules/landing/home/home.component';
import { IdlApplyComponent } from './modules/client/idl-apply/idl-apply.component';
import { TrackComponent } from './modules/common/track/track.component';
import { TrackViewComponent } from './modules/common/track-view/track-view.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  {
    path: 'vtp-apply',
    loadChildren: () => import('./modules/client/vtp-apply/vtp-apply-routes')
      .then(m => m.VTP_APPLY_ROUTES) 
  },

  { path: 'track', component: TrackComponent },
  { path: 'track-view/:id', component: TrackViewComponent },
  { path: 'idl-apply', component: IdlApplyComponent},

  { path: '**', component: HomeComponent},
];
