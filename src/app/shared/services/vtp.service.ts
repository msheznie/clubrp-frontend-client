import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { HelperService } from './helper.service';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class VtpService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private baseUrl = this.config.baseUrl;
  private apiversion = '/api/v1';
  private subdomain = inject(HelperService).getSubDomain();

  submitVtpApplication(payload: FormData | any): Observable<any> {
    if (payload instanceof FormData) {
      return this.http.post<any>(
        `${this.baseUrl}/${this.subdomain}${this.apiversion}/vtp/vtp-applications`,
        payload
      );
    } else {
      return this.http.post<any>(
        `${this.baseUrl}/${this.subdomain}${this.apiversion}/vtp/vtp-applications`,
        payload,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
      );
    }
  }

  getVtpApplicationAssignmentDetails(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${this.subdomain}${this.apiversion}/vtp/get-vtp-application-assignment-details`
    );
  }
}
