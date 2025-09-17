import { Component, OnInit } from '@angular/core';
import { CodePreviewComponent } from '../../../partials/code-preview/code-preview.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

const slidesOnly = {
  htmlCode: 
`@if (images) {
  <ngb-carousel [showNavigationArrows]="false" [showNavigationIndicators]="false">
    @for (image of images; track image) {
      <ng-template ngbSlide>
        <div class="picsum-img-wrapper">
          <img [src]="image" class="d-block w-100" alt="Random slide">
        </div>
      </ng-template>
    }
  </ngb-carousel>
}`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgbCarouselModule]
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  images = ['images/others/placeholder.jpg', 'images/others/placeholder.jpg', 'images/others/placeholder.jpg'];
}`
}

const widthControls = {
  htmlCode: 
`@if (images) {
  <ngb-carousel [showNavigationArrows]="true" [showNavigationIndicators]="false">
    @for (image of images; track image) {
      <ng-template ngbSlide>
        <div class="picsum-img-wrapper">
          <img [src]="image" class="d-block w-100" alt="Random slide">
        </div>
      </ng-template>
    }
  </ngb-carousel>
}`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgbCarouselModule]
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  images = ['images/others/placeholder.jpg', 'images/others/placeholder.jpg', 'images/others/placeholder.jpg'];
}`
}

const widthIndicators = {
  htmlCode: 
`@if (images) {
  <ngb-carousel [showNavigationArrows]="true" [showNavigationIndicators]="true">
    @for (image of images; track image) {
      <ng-template ngbSlide>
        <div class="picsum-img-wrapper">
          <img [src]="image" class="d-block w-100" alt="Random slide">
        </div>
      </ng-template>
    }
  </ngb-carousel>
}`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgbCarouselModule]
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  images = ['images/others/placeholder.jpg', 'images/others/placeholder.jpg', 'images/others/placeholder.jpg'];
}`
}

const widthCaptions = {
  htmlCode: 
`@if (images) {
  <ngb-carousel [showNavigationArrows]="true" [showNavigationIndicators]="true">
    <ng-template ngbSlide>
      <div class="picsum-img-wrapper">
        <img [src]="images[0]" class="d-block w-100" alt="Random first slide">
      </div>
      <div class="carousel-caption">
        <h5>First slide label</h5>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </div>
    </ng-template>
    <ng-template ngbSlide>
      <div class="picsum-img-wrapper">
        <img [src]="images[1]" class="d-block w-100" alt="Random second slide">
      </div>
      <div class="carousel-caption">
        <h5>Second slide label</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </ng-template>
    <ng-template ngbSlide>
      <div class="picsum-img-wrapper">
        <img [src]="images[2]" class="d-block w-100" alt="Random third slide">
      </div>
      <div class="carousel-caption">
        <h5>Third slide label</h5>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      </div>
    </ng-template>
  </ngb-carousel>
}`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgbCarouselModule]
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  images = ['images/others/placeholder.jpg', 'images/others/placeholder.jpg', 'images/others/placeholder.jpg'];
}`
}

const crossfadeCarousel = {
  htmlCode: 
`@if (images) {
  <ngb-carousel class="carousel-fade" [showNavigationArrows]="true" [showNavigationIndicators]="true">
    @for (image of images; track image) {
      <ng-template ngbSlide>
        <div class="picsum-img-wrapper">
          <img [src]="image" class="d-block w-100" alt="Random slide">
        </div>
      </ng-template>
    }
  </ngb-carousel>
}`,
  tsCode: 
`import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgbCarouselModule]
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  images = ['images/others/placeholder.jpg', 'images/others/placeholder.jpg', 'images/others/placeholder.jpg'];
}`
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    CodePreviewComponent,
    NgbCarouselModule,
  ],
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements OnInit {

  images = ['images/others/placeholder.jpg', 'images/others/placeholder.jpg', 'images/others/placeholder.jpg'];

  slidesOnlyCode: any;
  widthControlsCode: any;
  widthIndicatorsCode: any;
  widthCaptionsCode: any;
  crossfadeCarouselCode: any;

  constructor() { }

  ngOnInit(): void {
    this.slidesOnlyCode = slidesOnly;
    this.widthControlsCode = widthControls;
    this.widthIndicatorsCode = widthIndicators;
    this.widthCaptionsCode = widthCaptions;
    this.crossfadeCarouselCode = crossfadeCarousel;
  }

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }

}
