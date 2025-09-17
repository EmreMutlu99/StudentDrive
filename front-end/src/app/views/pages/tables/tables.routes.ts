import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'basic-tables', pathMatch: 'full' },
  {
    path: 'basic-tables',
    loadComponent: () => import('./basic-table/basic-table.component').then(c => c.BasicTableComponent)
  },
  {
    path: 'ngx-datatable',
    loadComponent: () => import('./ngx-datatable/ngx-datatable.component').then(c => c.NgxDatatableComponent)
  }
] as Routes