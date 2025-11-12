import { Routes } from '@angular/router';

export const clientsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/client-dashboard/client-dashboard.component').then(c => c.ClientDashboardComponent)
  }
];