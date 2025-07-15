import { Routes } from '@angular/router';

export const VTP_APPLY_ROUTES: Routes = [
    {
      path: '',
      loadComponent: () => import('./vtp-apply.component')
        .then(m => m.VtpApplyComponent)
    }
  ];