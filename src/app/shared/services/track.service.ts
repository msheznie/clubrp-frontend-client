import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { HelperService } from './helper.service';

export interface IdlApplication {
  id: number;
  code: string;
  invoice_id: number | null;
  license_type: number;
  overall_status: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  application_type: number | null;
  attachments: any[];
  basic_information: any;
  oman_license_information: any;
}

export interface IdlApplicationListResponse {
  success: boolean;
  data: {
    data: IdlApplication[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  message: string;
}

export interface IdlApplicationResponse {
  success: boolean;
  data: IdlApplication;
  message: string;
}

export interface IdlGenericResponse {
  success: boolean;
  data?: any;
  message: string;
}

export interface IdlStatisticsResponse {
  success: boolean;
  data: {
    total_applications: number;
    pending_applications: number;
    approved_applications: number;
    rejected_applications: number;
    under_review_applications: number;
  };
  message: string;
}

export interface IdlApplicationDetailsResponse {
  success: boolean;
  data: {
    idlApplication: IdlApplication;
    attachments: Array<{
      id: number;
      idl_application_id: number;
      attachment_id: number;
      attachment_type: number;
      attachment: {
        id: number;
        file_name: string;
        file_type: string;
        file_path: string;
      };
    }>;
    basic_information: {
      id: number;
      idl_application_id: number;
      first_name: string;
      last_name: string;
      other_name: string | null;
      email: string;
      gsm: string;
      date_of_birth: string;
      nationality: string;
      address: string;
      postal_code: string;
      po_box: string | null;
    };
    oman_license_information: {
      id: number;
      idl_application_id: number;
      oman_license_number: string;
      first_issue_date: string;
      countries_to_visit: string[];
      license_type_id: number;
      license_type: {
        id: number;
        license_type: string;
      };
    };
    licenseMasters: Array<{
      id: number;
      license_type: string;
      validity_options: string;
      price: number;
      user_id: number;
      status: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    }>;
  };
  message: string;
}

@Injectable({ providedIn: 'root' })
export class TrackService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private baseUrl = this.config.baseUrl;
  private apiversion = '/api/v1';
  private subdomain = inject(HelperService).getSubDomain();

  getIdlApplications(page: number = 1, perPage: number = 10, sortBy: string = 'created_at', sortOrder: string = 'desc'): Observable<IdlApplicationListResponse> {
    return this.http.get<IdlApplicationListResponse>(`${this.baseUrl}/${this.subdomain}${this.apiversion}/idl/get-idl-applications`, {
      params: {
        page: page.toString(),
        per_page: perPage.toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      }
    });
  }

  // Parity with IDL request list service: flexible params-based caller
  getApplications(params: IdlApplicationListParams): Observable<IdlApplicationListResponse> {
    const page = (params && params.page != null ? params.page : 1).toString();
    const perPage = (params && params.per_page != null ? params.per_page : 10).toString();
    const search = (params && params.search ? params.search.trim() : '');

    const baseParams: { [key: string]: string } = {
      page: page,
      per_page: perPage
    };

    if (search) baseParams['search'] = search;
    if (params && params.status) baseParams['status'] = params.status;
    if (params && params.application_type) baseParams['application_type'] = params.application_type;
    if (params && params.date_from) baseParams['date_from'] = params.date_from;
    if (params && params.date_to) baseParams['date_to'] = params.date_to;
    if (params && params.sort_by) baseParams['sort_by'] = params.sort_by;
    if (params && params.sort_order) baseParams['sort_order'] = params.sort_order as string;

    return this.http.get<IdlApplicationListResponse>(
      `${this.baseUrl}/${this.subdomain}${this.apiversion}/idl/get-applications-by-user`,
      { params: baseParams }
    );
  }

  getIdlApplicationDetails(id: number): Observable<IdlApplicationDetailsResponse> {
    return this.http.get<IdlApplicationDetailsResponse>(`${this.baseUrl}/${this.subdomain}${this.apiversion}/idl/get-track-application-data/${id}`);
  }
}

export interface IdlApplicationListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  application_type?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc' | string;
}


