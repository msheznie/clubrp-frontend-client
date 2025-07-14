import { Routes } from '@angular/router';

export const VTP_APPLY_ROUTES: Routes = [
    {
      path: '',
      loadComponent: () => import('./vtp-apply.component')
        .then(m => m.VtpApplyComponent),
      children: [
        // {
        //   path: 'basic-info',
        //   loadComponent: () => import('./components/basic-information/basic-information.component')
        //     .then(m => m.BasicInformationComponent),
        //   title: 'Basic Information'
        // }
      ]
    }
  ];