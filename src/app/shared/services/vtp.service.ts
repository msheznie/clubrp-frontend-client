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

  /**
   * Submit VTP application
   * Handles both FormData and JSON payloads
   */
  submitVtpApplication(payload: FormData | any): Observable<any> {
    if (payload instanceof FormData) {
      // For FormData, don't set Content-Type header (browser will set it with boundary)
      return this.http.post<any>(
        `${this.baseUrl}/${this.subdomain}${this.apiversion}/vtp/vtp-applications`,
        payload
      );
    } else {
      // For JSON, set Content-Type header
      return this.http.post<any>(
        `${this.baseUrl}/${this.subdomain}${this.apiversion}/vtp/vtp-applications`,
        payload,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
      );
    }
  }

  /**
   * Get VTP application assignment details (for vehicle types, etc.)
   */
  getVtpApplicationAssignmentDetails(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${this.subdomain}${this.apiversion}/vtp/get-vtp-application-assignment-details`
    );
  }
}
