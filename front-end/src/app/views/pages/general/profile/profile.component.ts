import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgbDropdownModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

}
