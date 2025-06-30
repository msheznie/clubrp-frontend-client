import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VtpApplyComponent } from './vtp-apply/vtp-apply.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'vtp-apply', component: VtpApplyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
