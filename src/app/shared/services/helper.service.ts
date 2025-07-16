import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HelperService {

  getSubDomain(){
    let subdomain = '';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length > 0) {
      subdomain = parts[0];
    }
    return subdomain;
  }

}