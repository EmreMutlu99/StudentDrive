import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input-mask',
  standalone: true,
  imports: [
    RouterLink,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './input-mask.component.html'
})
export class InputMaskComponent {

}
