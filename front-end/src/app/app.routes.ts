// app.routes.ts
import { Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeRedirectComponent } from './home-redirect.component/home-redirect.component.component'; // decides /dashboard vs /landing
import { loggedInRedirectGuard } from './core/guards/logged-in-redirect.guard'; // sends logged-in users away from /auth

export const routes: Routes = [
  // Root: decide based on current session
  { path: '', component: HomeRedirectComponent },

  // Public marketing page
  {
    path: 'landing',
    loadComponent: () =>
      import('./views/pages/auth/landing/landing.component').then(c => c.LandingComponent),
  },

  // Public auth area (login/register/legal). If already logged in, redirect to /dashboard.
  {
    path: 'auth',
    canMatch: [loggedInRedirectGuard],
    loadChildren: () => import('./views/pages/auth/auth.routes'),
  },

  // Private app shell — everything here is protected
  {
    path: '',
    component: BaseComponent,
    canActivateChild: [authGuard],
    children: [
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

  // Errors
  {
    path: 'error',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent),
  },
  {
    path: 'error/:type',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent)
  },

  // 404
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];
