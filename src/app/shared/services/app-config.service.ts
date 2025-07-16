import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http.get('/assets/config/app-config.json')
      .toPromise()
      .then(data => { this.appConfig = data; });
  }

  getConfig() {
    return this.appConfig;
  }

  get baseUrl(): string {
    return this.appConfig?.BASE_URL;
  }
  
}
