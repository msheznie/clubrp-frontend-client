import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { HelperService } from './helper.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private baseUrl = this.config.baseUrl;
  private apiversion = '/api/v1';
  private subdomain = inject(HelperService).getSubDomain();

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.subdomain}${this.apiversion}${endpoint}`, {
      params: new HttpParams({ fromObject: params })
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${this.subdomain}${this.apiversion}${endpoint}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${this.subdomain}${this.apiversion}${endpoint}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  delete<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${this.subdomain}${this.apiversion}${endpoint}`, {
      params: new HttpParams({ fromObject: params })
    });
  }

}