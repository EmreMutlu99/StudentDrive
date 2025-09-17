import { Component, Directive, EventEmitter, Input, OnInit, Output, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { CodePreviewComponent } from '../../../partials/code-preview/code-preview.component';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';

const defaultTable = {
  htmlCode: 
`<table class="table table-striped">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">Country</th>
			<th scope="col">Area</th>
			<th scope="col">Population</th>
		</tr>
	</thead>
	<tbody>
		@for (country of countries; track country.name; let i = $index) {
			<tr>
				<th scope="row">{{ i + 1 }}</th>
				<td>
					<img
						[src]="'https://upload.wikimedia.org/wikipedia/commons/' + country.flag"
						[alt]="'The flag of ' + country.name"
						class="me-2"
						style="width: 20px"
					/>
					{{ country.name }}
				</td>
				<td>{{ country.area | number }}</td>
				<td>{{ country.population | number }}</td>
			</tr>
		}
	</tbody>
</table>`,
  tsCode: 
`import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface Country {
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [DecimalPipe],
	templateUrl: './table.component.html',
})
export class TableComponent {
	countries = COUNTRIES;
}`
}

const sortableTable = {
  htmlCode: 
`<table class="table table-striped">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col" sortable="name" (sort)="onSort($event)">Country</th>
			<th scope="col" sortable="area" (sort)="onSort($event)">Area</th>
			<th scope="col" sortable="population" (sort)="onSort($event)">Population</th>
		</tr>
	</thead>
	<tbody>
		@for (country of countries; track country.name) {
			<tr>
				<th scope="row">{{ country.id }}</th>
				<td>
					<img
						[src]="'https://upload.wikimedia.org/wikipedia/commons/' + country.flag"
						[alt]="'The flag of ' + country.name"
						class="me-2"
						style="width: 20px"
					/>
					{{ country.name }}
				</td>
				<td>{{ country.area | number }}</td>
				<td>{{ country.population | number }}</td>
			</tr>
		}
	</tbody>
</table>`,
  tsCode: 
`import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface Country {
	id: number;
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		id: 1,
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		id: 2,
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		id: 3,
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		id: 4,
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

export type SortColumn = keyof Country | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [DecimalPipe, NgbdSortableHeader],
	templateUrl: './table.component.html',
})
export class TableComponent {
	countries = COUNTRIES;

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		for (const header of this.headers) {
			if (header.sortable !== column) {
				header.direction = '';
			}
		}

		// sorting countries
		if (direction === '' || column === '') {
			this.countries = COUNTRIES;
		} else {
			this.countries = [...COUNTRIES].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
		}
	}
}`
}

const searchFilteringTable = {
  htmlCode: 
`<form>
	<div class="mb-3 row">
		<label for="table-filtering-search" class="col-xs-3 col-sm-auto col-form-label">Full text search:</label>
		<div class="col-xs-3 col-sm-auto">
			<input id="table-filtering-search" class="form-control" type="text" [formControl]="filter" />
		</div>
	</div>
</form>

<table class="table table-striped">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">Country</th>
			<th scope="col">Area</th>
			<th scope="col">Population</th>
		</tr>
	</thead>
	<tbody>
		@for (country of countries$ | async; track country.name; let i = $index) {
			<tr>
				<th scope="row">{{ i + 1 }}</th>
				<td>
					<img
						[src]="'https://upload.wikimedia.org/wikipedia/commons/' + country.flag"
						[alt]="'The flag of ' + country.name"
						class="me-2"
						style="width: 20px"
					/>
					<ngb-highlight [result]="country.name" [term]="filter.value" />
				</td>
				<td><ngb-highlight [result]="country.area | number" [term]="filter.value" /></td>
				<td><ngb-highlight [result]="country.population | number" [term]="filter.value" /></td>
			</tr>
		} @empty {
			<tr>
				<td colspan="4" style="text-align: center">No countries found</td>
			</tr>
		}
	</tbody>
</table>`,
  tsCode: 
`import { Component, PipeTransform } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { map, Observable, startWith } from 'rxjs';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

interface Country {
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

function search(text: string, pipe: PipeTransform): Country[] {
	return COUNTRIES.filter((country) => {
		const term = text.toLowerCase();
		return (
			country.name.toLowerCase().includes(term) ||
			pipe.transform(country.area).includes(term) ||
			pipe.transform(country.population).includes(term)
		);
	});
}

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight],
	templateUrl: './table.component.html',
	providers: [DecimalPipe]
})
export class TableComponent {
	countries$: Observable<Country[]>;
	filter = new FormControl('', { nonNullable: true });

	constructor(pipe: DecimalPipe) {
		this.countries$ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => search(text, pipe)),
		);
	}
}`
}

const paginationTable = {
  htmlCode: 
`<table class="table table-striped">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">Country</th>
			<th scope="col">Area</th>
			<th scope="col">Population</th>
		</tr>
	</thead>
	<tbody>
		@for (country of countries; track country.name) {
			<tr>
				<th scope="row">{{ country.id }}</th>
				<td>
					<img
						[src]="'https://upload.wikimedia.org/wikipedia/commons/' + country.flag"
						[alt]="'The flag of ' + country.name"
						class="me-2"
						style="width: 20px"
					/>
					{{ country.name }}
				</td>
				<td>{{ country.area | number }}</td>
				<td>{{ country.population | number }}</td>
			</tr>
		}
	</tbody>
</table>

<div class="d-flex justify-content-between p-2">
	<ngb-pagination
		[collectionSize]="collectionSize"
		[(page)]="page"
		[pageSize]="pageSize"
		(pageChange)="refreshCountries()"
	>
	</ngb-pagination>

	<select class="form-select" style="width: auto" [(ngModel)]="pageSize" (ngModelChange)="refreshCountries()">
		<option [ngValue]="2">2 items per page</option>
		<option [ngValue]="4">4 items per page</option>
		<option [ngValue]="6">6 items per page</option>
	</select>
</div>`,
  tsCode: 
`import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

interface Country {
	id?: number;
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		id: 1,
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		id: 2,
		name: 'France',
		flag: 'c/c3/Flag_of_France.svg',
		area: 640679,
		population: 64979548,
	},
	{
		id: 3,
		name: 'Germany',
		flag: 'b/ba/Flag_of_Germany.svg',
		area: 357114,
		population: 82114224,
	},
	{
		id: 4,
		name: 'Portugal',
		flag: '5/5c/Flag_of_Portugal.svg',
		area: 92090,
		population: 10329506,
	},
	{
		id: 5,
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		id: 6,
		name: 'Vietnam',
		flag: '2/21/Flag_of_Vietnam.svg',
		area: 331212,
		population: 95540800,
	},
	{
		id: 7,
		name: 'Brazil',
		flag: '0/05/Flag_of_Brazil.svg',
		area: 8515767,
		population: 209288278,
	},
	{
		id: 8,
		name: 'Mexico',
		flag: 'f/fc/Flag_of_Mexico.svg',
		area: 1964375,
		population: 129163276,
	},
	{
		id: 9,
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		id: 10,
		name: 'India',
		flag: '4/41/Flag_of_India.svg',
		area: 3287263,
		population: 1324171354,
	},
	{
		id: 11,
		name: 'Indonesia',
		flag: '9/9f/Flag_of_Indonesia.svg',
		area: 1910931,
		population: 263991379,
	},
	{
		id: 12,
		name: 'Tuvalu',
		flag: '3/38/Flag_of_Tuvalu.svg',
		area: 26,
		population: 11097,
	},
	{
		id: 13,
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [DecimalPipe, FormsModule, NgbTypeaheadModule, NgbPaginationModule],
	templateUrl: './table.component.html',
})
export class TableComponent {
	page = 1;
	pageSize = 4;
	collectionSize = COUNTRIES.length;
	countries: Country[];

  constructor() {
		this.refreshCountries();
	}

	refreshCountries() {
		this.countries = COUNTRIES.map((country, i) => ({ id: i + 1, ...country })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}
}`
}

interface Country {
	id: number;
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		id: 1,
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		id: 2,
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		id: 3,
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		id: 4,
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

export type SortColumn = keyof Country | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}

function search(text: string, pipe: PipeTransform): Country[] {
	return COUNTRIES.filter((country) => {
		const term = text.toLowerCase();
		return (
			country.name.toLowerCase().includes(term) ||
			pipe.transform(country.area).includes(term) ||
			pipe.transform(country.population).includes(term)
		);
	});
}

const COUNTRIES_PAGINATION: Country[] = [
	{
    id: 1,
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
    id: 2,
		name: 'France',
		flag: 'c/c3/Flag_of_France.svg',
		area: 640679,
		population: 64979548,
	},
	{
    id: 3,
		name: 'Germany',
		flag: 'b/ba/Flag_of_Germany.svg',
		area: 357114,
		population: 82114224,
	},
	{
    id: 4,
		name: 'Portugal',
		flag: '5/5c/Flag_of_Portugal.svg',
		area: 92090,
		population: 10329506,
	},
	{
    id: 5,
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
    id: 6,
		name: 'Vietnam',
		flag: '2/21/Flag_of_Vietnam.svg',
		area: 331212,
		population: 95540800,
	},
	{
    id: 7,
		name: 'Brazil',
		flag: '0/05/Flag_of_Brazil.svg',
		area: 8515767,
		population: 209288278,
	},
	{
    id: 8,
		name: 'Mexico',
		flag: 'f/fc/Flag_of_Mexico.svg',
		area: 1964375,
		population: 129163276,
	},
	{
    id: 9,
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
    id: 10,
		name: 'India',
		flag: '4/41/Flag_of_India.svg',
		area: 3287263,
		population: 1324171354,
	},
	{
    id: 11,
		name: 'Indonesia',
		flag: '9/9f/Flag_of_Indonesia.svg',
		area: 1910931,
		population: 263991379,
	},
	{
    id: 12,
		name: 'Tuvalu',
		flag: '3/38/Flag_of_Tuvalu.svg',
		area: 26,
		population: 11097,
	},
	{
    id: 13,
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CodePreviewComponent,
    DecimalPipe,
    NgbdSortableHeader,
    AsyncPipe,
    ReactiveFormsModule,
    NgbHighlight,
    FormsModule,
    NgbTypeaheadModule,
    NgbPaginationModule
  ],
  templateUrl: './table.component.html',
  providers: [DecimalPipe]
})
export class TableComponent implements OnInit {

	countries = COUNTRIES;
  
  countries$: Observable<Country[]>;
	filter = new FormControl('', { nonNullable: true });
  
  page = 1;
	pageSize = 4;
	collectionSize = COUNTRIES_PAGINATION.length;
	countries_pagination: Country[];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  defaultTableCode: any;
  sortableTableCode: any;
  searchFilteringTableCode: any;
  paginationTableCode: any;

  constructor(pipe: DecimalPipe) {
		this.countries$ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => search(text, pipe)),
		);

    this.refreshCountries();
	}

  ngOnInit(): void {
    this.defaultTableCode = defaultTable;
    this.sortableTableCode = sortableTable;
    this.searchFilteringTableCode =  searchFilteringTable;
    this.paginationTableCode = paginationTable;
  }

  onSort({ column, direction }: SortEvent) {
		// resetting other headers
		for (const header of this.headers) {
			if (header.sortable !== column) {
				header.direction = '';
			}
		}

		// sorting countries
		if (direction === '' || column === '') {
			this.countries = COUNTRIES;
		} else {
			this.countries = [...COUNTRIES].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
		}
	}

  refreshCountries() {
		this.countries_pagination = COUNTRIES_PAGINATION.map((country, i) => ({ _id: i + 1, ...country })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

  scrollTo(element: any) {
    element.scrollIntoView({behavior: 'smooth'});
  }
}
