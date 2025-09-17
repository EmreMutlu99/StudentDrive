import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentChange, QuillModule, SelectionChange } from 'ngx-quill'

@Component({
  selector: 'app-editors',
  standalone: true,
  imports: [
    RouterLink,
    QuillModule,
    FormsModule
  ],
  templateUrl: './editors.component.html'
})
export class EditorsComponent {

  htmlText = `<p> If You Can Think It, You Can Do It. </p>`
  quillConfig = {
     toolbar: {
       container: [
         ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
         ['code-block'],
        //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
         [{ 'list': 'ordered'}, { 'list': 'bullet' }],
         [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
         [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //  [{ 'direction': 'rtl' }],                         // text direction

        //  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

         [{ 'align': [] }],

        //  ['clean'],                                         // remove formatting button

        //  ['link'],
         ['link', 'image', 'video']
       ],
     },
  }

  constructor() {}

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
