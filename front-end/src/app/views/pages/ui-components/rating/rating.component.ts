import { Component } from '@angular/core';
import { CodePreviewComponent } from '../../../partials/code-preview/code-preview.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';

const defaultRating = {
  htmlCode: 
`<ngb-rating [(rate)]="currentRate"></ngb-rating>

<p class="text-secondary mt-2">Rate: <b>{{currentRate}}</b></p>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [NgbRatingModule],
  templateUrl: './rating.component.html'
})
export class RatingComponent {
  currentRate = 8;
}`
}

const customTemplate = {
  htmlCode: 
`<ngb-rating [(rate)]="currentRate">
  <ng-template let-fill="fill" let-index="index">
    <span [class.filled]="fill === 100" [class.bad]="index < 3">
      <i data-feather="star" appFeatherIcon></i>
    </span>
  </ng-template>
</ngb-rating>

<p class="text-secondary mt-2">Rate: <b>{{currentRate}}</b></p>`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [NgbRatingModule, FeatherIconDirective],
  templateUrl: './rating.component.html',
  styles: [\`
    svg, i {
      color: rgba(114, 124, 245, 0.3);
    }
    i {
      font-size: 1.5rem;
    }
    svg {
      width: 20px;
      height: 20px;
    }
    .filled svg, .filled i {
      color: #727cf5;
    }
    .bad svg, .bad i {
      color: rgba(255, 51, 102, 0.3);
    }
    .filled.bad svg, .filled.bad i {
      color: #ff3366;
    }
  \`]
})
export class RatingComponent {
  currentRate = 8;
}`
}

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    CodePreviewComponent,
    NgbRatingModule,
    FeatherIconDirective
  ],
  templateUrl: './rating.component.html',
  styles: [`
    svg, i {
      color: rgba(114, 124, 245, 0.3);
    }
    i {
      font-size: 1.5rem;
    }
    svg {
      width: 20px;
      height: 20px;
    }
    .filled svg, .filled i {
      color: #727cf5;
    }
    .bad svg, .bad i {
      color: rgba(255, 51, 102, 0.3);
    }
    .filled.bad svg, .filled.bad i {
      color: #ff3366;
    }
  `]
})
export class RatingComponent {

  currentRate = 8;

  defaultRatingCode: any;
  customTemplateCode: any;

  constructor() { }

  ngOnInit(): void {
    this.defaultRatingCode = defaultRating;
    this.customTemplateCode = customTemplate
  }

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }

}
