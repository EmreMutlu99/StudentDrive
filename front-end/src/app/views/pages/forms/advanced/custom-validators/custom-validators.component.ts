import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';

@Component({
  selector: 'app-custom-validators',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NarikCustomValidatorsModule
  ],
  templateUrl: './custom-validators.component.html'
})
export class CustomValidatorsComponent {

}
