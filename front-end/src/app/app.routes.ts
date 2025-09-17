import { Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.routes')},
  {
    path: '',
    component: BaseComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.routes')
      },
      {
        path: 'apps',
        loadChildren: () => import('./views/pages/apps/apps.routes')
      },
      {
        path: 'ui-components',
        loadChildren: () => import('./views/pages/ui-components/ui-components.routes')
      },
      {
        path: 'advanced-ui',
        loadChildren: () => import('./views/pages/advanced-ui/advanced-ui.routes')
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/pages/forms/forms.routes')
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/pages/charts/charts.routes')
      },
      {
        path: 'tables',
        loadChildren: () => import('./views/pages/tables/tables.routes')
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/pages/icons/icons.routes')
      },
      {
        path: 'general',
        loadChildren: () => import('./views/pages/general/general.routes')
      }
    ]
  },
  {
    path: 'error',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent),
  },
  {
    path: 'error/:type',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent)
  },
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];
