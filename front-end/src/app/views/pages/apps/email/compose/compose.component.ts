import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { ContentChange, QuillModule, SelectionChange } from 'ngx-quill';
import { PeoplesData } from '../../../../../core/dummy-datas/peoples.data';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    FormsModule,
    QuillModule
  ],
  templateUrl: './compose.component.html',
  styleUrl: './compose.component.scss'
})
export class ComposeComponent implements OnInit {
  
  peoples: any[] = [];
  selectedTo: any[] = [];
  selectedCc: any[] = [];

  messageValue = '';
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                      // text direction
        [{ 'align': [] }],
        ['link', 'image', 'video']
      ],
    },
  }

  constructor() {}

  ngOnInit(): void {
    this.peoples = PeoplesData.peoples;
    this.selectedTo = [this.peoples[2].id]
    this.selectedCc = [this.peoples[3].id, this.peoples[4].id, this.peoples[5].id]
  }

  onSelectionChanged = (event: SelectionChange) => {
    if(event.oldRange == null) {
      this.onFocus();
    }
    if(event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event: ContentChange) => {
    // console.log(event.html);
  }

  onFocus = () => {
    console.log("On Focus");
  }
  onBlur = () => {
    console.log("Blurred");
  }

}
