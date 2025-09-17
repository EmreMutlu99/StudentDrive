import { Component, Input } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Highlight } from 'ngx-highlightjs';
import { ClipboardModule } from 'ngx-clipboard';

@Component({
  selector: 'app-code-preview',
  standalone: true,
  imports: [
    NgbNavModule,
    Highlight,
    ClipboardModule
  ],
  templateUrl: './code-preview.component.html'
})
export class CodePreviewComponent {

  // Public properties
  @Input() codeContent: any;
  defaultNavActiveId = undefined;
  copy: string = 'copy';

  constructor() {}

  copied(e: any) {
    if(e.isSuccess) {
      this.copy = 'copied';
      setTimeout(() => {
        this.copy = 'copy';
      }, 500);
    }
  }

}
