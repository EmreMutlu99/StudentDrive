import { Component } from '@angular/core';
import { CodePreviewComponent } from '../../../partials/code-preview/code-preview.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

const defaultPopover = {
  htmlCode: 
`<button type="button" class="btn btn-primary" popoverTitle="Popover title" ngbPopover="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popovers',
  standalone: true,
  imports: [NgbPopoverModule],
  templateUrl: './popovers.component.html'
})
export class PopoversComponent {}`
}

const popoverDirecions = {
  htmlCode: 
`<button type="button" class="btn btn-primary mb-1 mb-md-0 me-1" placement="top" ngbPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on top
</button>
<button type="button" class="btn btn-primary mb-1 mb-md-0 me-1" placement="end" ngbPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on right
</button>
<button type="button" class="btn btn-primary mb-1 mb-md-0 me-1" placement="bottom" ngbPopover="Vivamus
sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on bottom
</button>
<button type="button" class="btn btn-primary mb-1 mb-md-0 me-1" placement="start" ngbPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on left
</button>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popovers',
  standalone: true,
  imports: [NgbPopoverModule],
  templateUrl: './popovers.component.html'
})
export class PopoversComponent {}`
}

@Component({
  selector: 'app-popovers',
  standalone: true,
  imports: [
    CodePreviewComponent,
    NgbPopoverModule
  ],
  templateUrl: './popovers.component.html'
})
export class PopoversComponent {

  defaultPopoverCode: any;
  popoverDirecionsCode: any;

  constructor() { }

  ngOnInit(): void {
    this.defaultPopoverCode = defaultPopover;
    this.popoverDirecionsCode = popoverDirecions;
  }

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }

}
