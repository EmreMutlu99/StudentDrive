import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-ngx-chips',
  standalone: true,
  imports: [
    RouterLink,
    TagInputModule,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './ngx-chips.component.html'
})
export class NgxChipsComponent {
  
  items = ['Pizza', 'Pasta', 'Parmesan'];
  itemsAsObjects = [{id: 0, name: 'Pizza', readonly: true}, {id: 1, name: 'Pasta'}, {id: 2, name: 'Parmesan', readonly: true}];
  itemsWithMaxLimit = ['Pizza', 'Pasta', 'Parmesan'];

  constructor() {}

  onAdd(item: any) {
    console.log('tag added: value is ' + item.value);
  }

  onSelect(item: any) {
    console.log('tag selected: value is ' + item);
  }

  onTagEdited(item: any) {
    console.log('tag edited: current value is ' + item);    
  }

  onTextChange(text: any) {
    console.log('text changed: value is ' + text);
  }

}
