import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'apexcharts', pathMatch: 'full' },
  {
    path: 'apexcharts',
    loadComponent: () => import('./apexcharts/apexcharts.component').then(c => c.ApexchartsComponent)
  },
  {
    path: 'chartjs',
    loadComponent: () => import('./chartjs/chartjs.component').then(c => c.ChartjsComponent)
  }
] as Routes;