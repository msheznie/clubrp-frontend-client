import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/landing/home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  {
    path: 'vtp-apply',
    loadChildren: () => import('./modules/client/vtp-apply/vtp-apply-routes')
      .then(m => m.VTP_APPLY_ROUTES) 
  },

  { path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
