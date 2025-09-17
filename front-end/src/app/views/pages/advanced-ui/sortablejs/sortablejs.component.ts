import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SortablejsModule } from 'nxt-sortablejs';
import { Options } from 'sortablejs';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sortablejs',
  standalone: true,
  imports: [
    RouterLink,
    SortablejsModule, 
    JsonPipe, 
    FeatherIconDirective
  ],
  templateUrl: './sortablejs.component.html'
})
export class SortablejsComponent {

  // - Simple List - //

  simpleItems = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6'
  ];





  // - Transfer Between Lists - //

  sharedItems1 = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6'
  ];

  sharedItems2 = [
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12'
  ];

  sharedOptions: Options = {
    group: 'shared-group',
  };





  // - Disabling Sorting - //

  disablingSortingItems1 = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6'
  ];

  disablingSortingItems2 = [
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12'
  ];

  disablingSorting1Options: Options = {
    group: {
      name: 'disable-group',
      pull: 'clone',
      put: false,
    },
    sort: false
  };

  disablingSorting2Options: Options = {
    group: {
      name: 'disable-group',
    },
  };





  // - Disabled options - //

  draggableItems = [
    { draggable: true, text: 'Item 1' },
    { draggable: true, text: 'Item 2' },
    { draggable: false, text: 'Item 3' },
    { draggable: true, text: 'Item 4' },
    { draggable: true, text: 'Item 5' }
  ];

  draggableOptions: Options = {
    draggable: '.draggable',
  };





  // - Events - //

  eventItems = [
    1,
    2,
    3,
    4,
    5
  ];

  eventUpdateCounter = 0;
  eventOptions: Options = {
    onUpdate: () => this.eventUpdateCounter++,
  };

}
