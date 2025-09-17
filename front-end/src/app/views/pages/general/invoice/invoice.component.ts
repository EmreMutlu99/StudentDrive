import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    FeatherIconDirective,
    RouterLink
  ],
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent {

}
