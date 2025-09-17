import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // ⬅️ gives *ngFor/*ngIf, pipes, etc.

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    NgStyle,
    RouterLink
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  year = new Date().getFullYear(); // ⬅️ use this in template

  logos = [
    { alt: 'Uni 1', src: 'https://placehold.co/120x40?text=Uni+1' },
    { alt: 'Uni 2', src: 'https://placehold.co/120x40?text=Uni+2' },
    { alt: 'Uni 3', src: 'https://placehold.co/120x40?text=Uni+3' },
    { alt: 'Uni 4', src: 'https://placehold.co/120x40?text=Uni+4' },
    { alt: 'Uni 5', src: 'https://placehold.co/120x40?text=Uni+5' }
  ];

  subjects = [
    'Computer Science', 'Economics', 'Mathematics', 'Law',
    'Medicine', 'Psychology', 'Architecture', 'Mechanical Eng.'
  ];

  testimonials = [
    {
      quote: 'I find past exams and concise notes in minutes.',
      name: 'Elena • CS @ TUM'
    },
    {
      quote: 'The course tagging makes discovering materials effortless.',
      name: 'Mert • Econ @ Boğaziçi'
    },
    {
      quote: 'Clean, fast, and actually useful for revision weeks.',
      name: 'Ana • Med @ UMF'
    }
  ];
}
