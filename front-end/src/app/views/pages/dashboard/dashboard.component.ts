import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbCalendar,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import {
  ThemeCssVariableService,
  ThemeCssVariablesType,
} from '../../../core/services/theme-css-variable.service';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';
import { filter, Observable, take } from 'rxjs';
import {FileUploadComponent} from "./file-upload/file-upload.component"
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbDropdownModule,
    FormsModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    FeatherIconDirective,
    FileUploadComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user$!: Observable<CurrentUser | null | false>;

  themeCssVariables = inject(ThemeCssVariableService).getThemeCssVariables();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // ensure we have the user (will fetch /me only if not cached)
    this.auth.ensureSession().subscribe();
    this.user$ = this.auth.user$;
    console.log('this.user$: ', this.user$);
    
  }


}
