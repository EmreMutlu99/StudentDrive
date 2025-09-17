import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent),
    }
] as Routes;