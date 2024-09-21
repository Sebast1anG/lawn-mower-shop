import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/configuration', pathMatch: 'full' },
  {
    path: 'configuration',
    loadComponent: () =>
      import(
        './components/configuration-form/configuration-form.component'
      ).then((m) => m.ConfigurationFormComponent),
  },
  {
    path: 'order',
    loadComponent: () =>
      import('./components/order-form/order-form.component').then(
        (m) => m.OrderFormComponent
      ),
  },
  {
    path: 'summary',
    loadComponent: () =>
      import('./components/summary/summary.component').then(
        (m) => m.SummaryComponent
      ),
  },
];
