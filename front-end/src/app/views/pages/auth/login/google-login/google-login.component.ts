// google-button.component.ts
import { Component, AfterViewInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-google-button',
  standalone: true,
  template: `<div id="gsi-btn"></div>`
})
export class GoogleButtonComponent implements AfterViewInit {
  http = inject(HttpClient);

  ngAfterViewInit() {
    // @ts-ignore - global from GIS script
    google.accounts.id.initialize({
      client_id: environment.googleClientId,  // use env var here too
      callback: (resp: any) => this.handleCredential(resp.credential),
      auto_select: false
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById('gsi-btn'),
      { type: 'standard', size: 'large', theme: 'outline', shape: 'pill' }
    );
  }

  private handleCredential(jwt: string) {
    this.http
      .post(`${environment.baseUrl}/api/auth/google`, { id_token: jwt })
      .subscribe(() => {
        location.href = '/dashboard';
      });
  }
}
