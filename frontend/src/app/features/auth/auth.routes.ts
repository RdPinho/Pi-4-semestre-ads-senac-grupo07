import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register-client',
    loadComponent: () => import('./components/register-client/register-client.component').then(c => c.RegisterClientComponent)
  },
  {
    path: 'register-professional',
    loadComponent: () => import('./components/register-professional/register-professional.component').then(c => c.RegisterProfessionalComponent)
  },
  // Redirect antigo para compatibilidade
  {
    path: 'register',
    redirectTo: 'register-client',
    pathMatch: 'full'
  }
];