import { Routes } from '@angular/router';

export const professionalsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/professional-dashboard/professional-dashboard.component').then(c => c.ProfessionalDashboardComponent)
  }
];