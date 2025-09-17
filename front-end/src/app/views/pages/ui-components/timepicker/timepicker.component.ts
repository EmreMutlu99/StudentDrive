import { Component } from '@angular/core';
import { CodePreviewComponent } from '../../../partials/code-preview/code-preview.component';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

const defaultTimepicker = {
  htmlCode: 
`<ngb-timepicker [(ngModel)]="time"></ngb-timepicker>
      
<p class="text-secondary mt-2">Selected time: {{time | json}}</p>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [NgbTimepickerModule, FormsModule, JsonPipe]
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent {
  time = {hour: 13, minute: 30};
}`
}

const meridian = {
  htmlCode: 
`<ngb-timepicker [(ngModel)]="time" [meridian]="true"></ngb-timepicker>
      
<p class="text-secondary mt-2">Selected time: {{time | json}}</p>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [NgbTimepickerModule, FormsModule, JsonPipe]
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent {
  time = {hour: 13, minute: 30};
}`
}

const seconds = {
  htmlCode: 
`<ngb-timepicker [(ngModel)]="time" [seconds]="true" [meridian]="true"></ngb-timepicker>
      
<p class="text-secondary mt-2">Selected time: {{time | json}}</p>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [NgbTimepickerModule, FormsModule, JsonPipe]
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent {
  time = {hour: 13, minute: 30, second: 20};
}`
}

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [
    CodePreviewComponent,
    NgbTimepickerModule,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent {

  time = {hour: 13, minute: 30};
  timeWithSeconds = {hour: 13, minute: 30, second: 20};

  defaultTimepickerCode: any;
  meridianCode: any;
  secondsCode: any;

  constructor() { }

  ngOnInit(): void {
    this.defaultTimepickerCode = defaultTimepicker;
    this.meridianCode = meridian;
    this.secondsCode = seconds;
  }

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }

}
