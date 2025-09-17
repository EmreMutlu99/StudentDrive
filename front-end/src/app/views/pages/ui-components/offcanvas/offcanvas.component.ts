import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { CodePreviewComponent } from '../../../partials/code-preview/code-preview.component';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

const defaultOffcanvas = {
  htmlCode: 
`<ng-template #content let-offcanvas>
	<div class="offcanvas-header">
		<h4 class="offcanvas-title" id="offcanvas-basic-title">Profile update</h4>
		<button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss('Cross click')"></button>
	</div>
	<div class="offcanvas-body">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente veniam eaque nam, sequi voluptatum accusantium commodi repellat dolores corporis eius omnis cupiditate facilis reprehenderit et eum laudantium maxime itaque! Odio?</p>
		<div class="text-end">
			<button type="button" class="btn btn-outline-secondary" (click)="offcanvas.close('Save click')">Save</button>
		</div>
	</div>
</ng-template>

<button class="btn btn-lg btn-outline-primary" (click)="open(content)">Launch demo offcanvas</button>

@if (closeResult) {
  <hr />
  <p>{{ closeResult }}</p>
}`,
  tsCode: 
`import { Component, inject, TemplateRef } from '@angular/core';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-offcanvas',
	standalone: true,
	imports: [],
	templateUrl: './offcanvas.component.html',
})
export class OffcanvasComponent {
	private offcanvasService = inject(NgbOffcanvas);
	closeResult = '';

	open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult = "Closed with: " + result;
			},
			(reason) => {
				this.closeResult = "Dismissed " + this.getDismissReason(reason);
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case OffcanvasDismissReasons.ESC:
				return 'by pressing ESC';
			case OffcanvasDismissReasons.BACKDROP_CLICK:
				return 'by clicking on the backdrop';
			default:
				return "with: " + reason;
		}
	}
}`
}

const offcanvasOptions = {
  htmlCode: 
`<ng-template #content2 let-offcanvas>
	<div class="offcanvas-header">
		<h4 class="offcanvas-title">Offcanvas title</h4>
		<button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss('Cross click')"></button>
	</div>
	<div class="offcanvas-body">
		<p>One fine body&hellip;</p>
		<div class="text-end">
			<button type="button" class="btn btn-outline-secondary" (click)="offcanvas.close('Close click')">Close</button>
		</div>
	</div>
</ng-template>

<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openEnd(content2)">Right position</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openTop(content2)">Top position</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openBottom(content2)">Bottom position</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openNoBackdrop(content2)">No backdrop</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openStaticBackdrop(content2)">Static backdrop</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openScroll(content2)">
	Scrolling of main content enabled
</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openNoKeyboard(content2)">
	Escape does not dismiss
</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openNoAnimation(content2)">No animation</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openCustomBackdropClass(content2)">
	Custom backdrop class
</button>
<button class="btn btn-lg btn-outline-primary mb-2 me-2" (click)="openCustomPanelClass(content2)">
	Custom panel class
</button>`,
  tsCode: 
`import { Component, inject, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-offcanvas',
	standalone: true,
	templateUrl: './offcanvas.component.html'
})
export class OffcanvasComponent {
	private offcanvasService = inject(NgbOffcanvas);

	openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}

	openTop(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'top' });
	}

	openBottom(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'bottom' });
	}

	openNoBackdrop(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { backdrop: false });
	}

	openStaticBackdrop(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { backdrop: 'static' });
	}

	openScroll(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { scroll: true });
	}

	openNoKeyboard(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { keyboard: false });
	}

	openNoAnimation(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { animation: false });
	}

	openCustomBackdropClass(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { backdropClass: 'bg-info' });
	}

	openCustomPanelClass(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { panelClass: 'bg-info' });
	}
}`
}

@Component({
  selector: 'app-offcanvas',
  standalone: true,
  imports: [
    CodePreviewComponent
  ],
  templateUrl: './offcanvas.component.html'
})
export class OffcanvasComponent implements OnInit {

	private offcanvasService = inject(NgbOffcanvas);
	closeResult = '';

  defaultOffcanvasCode: any;
  offcanvasOptionsCode: any;

  ngOnInit(): void {
    this.defaultOffcanvasCode = defaultOffcanvas;
    this.offcanvasOptionsCode = offcanvasOptions;
  }

  openBasicOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case OffcanvasDismissReasons.ESC:
				return 'by pressing ESC';
			case OffcanvasDismissReasons.BACKDROP_CLICK:
				return 'by clicking on the backdrop';
			default:
				return `with: ${reason}`;
		}
	}


  openEndOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}

	openTopOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'top' });
	}

	openBottomOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'bottom' });
	}

	openNoBackdropOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { backdrop: false });
	}

	openStaticBackdropOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { backdrop: 'static' });
	}

	openScrollOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { scroll: true });
	}

	openNoKeyboardOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { keyboard: false });
	}

	openNoAnimationOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { animation: false });
	}

	openCustomBackdropClassOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { backdropClass: 'bg-info' });
	}

	openCustomPanelClassOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { panelClass: 'bg-info' });
	}

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }

}
