import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent as MyNgSelectComponent } from '@ng-select/ng-select';

import { PeoplesData, Person } from '../../../../../core/dummy-datas/peoples.data';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ng-select',
  standalone: true,
  imports: [
    RouterLink,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    MyNgSelectComponent,
    FormsModule,
    UpperCasePipe,
  ],
  templateUrl: './ng-select.component.html'
})
export class NgSelectComponent implements OnInit {

  simpleItems: any = [];
  selectedSimpleItem: any = null;

  people: Person[] = [];
  selectedPersonId: string = '';

  selectedSearchPersonId: string = '';

  selectedPeople: any = null;

  groupedMultiSelectedPeople: any = null;

  customTemplateSelectedPeople: any = null;

  constructor() {}

  ngOnInit(): void {
    
    // simple array
    this.simpleItems = [true, 'Two', 3];

    // array of objects
    this.people = PeoplesData.peoples;

  }

}
