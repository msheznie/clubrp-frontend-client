import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { HelperService } from './helper.service';

@Injectable({ providedIn: 'root' })
export class IdlService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private baseUrl = this.config.baseUrl;
  private apiversion = '/api/v1';
  private subdomain = inject(HelperService).getSubDomain();

  submitIdlApplication(formData: any): Observable<any> {
    const submitData = new FormData();

    submitData.append('formData', JSON.stringify(formData.data));
    submitData.append('userId', formData.userId);

    if (formData.data.documents && formData.data.documents.length > 0) {
      formData.data.documents.forEach((file: File, index: number) => {
        submitData.append(`document_${index}`, file);
      });
    }

    if (formData.data.photo) {
      submitData.append('photo', formData.data.photo);
    }

    return this.http.post<any>(`${this.baseUrl}/${this.subdomain}${this.apiversion}/idl/submit-application`, submitData);
  }

  getLicenseMasters(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${this.subdomain}${this.apiversion}/idl/get-license-masters`);
  }

  getCountryList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${this.subdomain}${this.apiversion}/idl/get-country-list`);
  }

}