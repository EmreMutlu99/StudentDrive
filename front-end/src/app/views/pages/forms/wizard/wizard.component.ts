import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArchwizardModule } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [
    RouterLink,
    ArchwizardModule,
    NgClass,
    ReactiveFormsModule,
    FeatherIconDirective
  ],
  templateUrl: './wizard.component.html'
})
export class WizardComponent implements OnInit {

  validationForm1: UntypedFormGroup;
  validationForm2: UntypedFormGroup;

  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;

  constructor(public formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    
    /**
     * form1 value validation
     */
    this.validationForm1 = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      userName : ['', Validators.required]
    });

    /**
     * formw value validation
     */
    this.validationForm2 = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      mobileNumber : ['', Validators.required],
      password : ['', Validators.required]
    });

    this.isForm1Submitted = false;
    this.isForm2Submitted = false;

  }


  /**
   * Wizard finish function
   */
  finishFunction() {
    alert('Successfully Completed');
  }

  
  /**
   * Returns form
   */
  get form1() {
    return this.validationForm1.controls;
  }


  /**
   * Returns form
   */
  get form2() {
    return this.validationForm2.controls;
  }


  /**
   * Go to next step while form value is valid
   */
  form1Submit() {
    if(this.validationForm1.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm1Submitted = true;
  }


  /**
   * Go to next step while form value is valid
   */
  form2Submit() {
    if(this.validationForm2.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm2Submitted = true;
  }

  
}
