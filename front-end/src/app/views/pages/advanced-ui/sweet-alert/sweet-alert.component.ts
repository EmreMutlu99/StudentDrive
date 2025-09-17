import { Component, importProvidersFrom } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-sweet-alert',
  standalone: true,
  imports: [
    RouterLink,
    SweetAlert2Module
  ],
  templateUrl: './sweet-alert.component.html'
})
export class SweetAlertComponent {

}
