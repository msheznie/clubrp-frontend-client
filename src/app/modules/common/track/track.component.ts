import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { TrackService, IdlApplication } from '../../../shared/services/track.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NavbarComponent,
    BreadcrumbComponent,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class TrackComponent implements OnInit {
  private router = inject(Router);
  private trackService = inject(TrackService);

  breadcrumbs = [
    { label: 'Oman Automobile Association', link: '/association' },
    { label: 'Vehicle Transportation Permit', link: '/vehicle-transport' },
    { label: 'Track Update' }
  ];

  applications: IdlApplication[] = [];
  dataSource: MatTableDataSource<IdlApplication> = new MatTableDataSource<IdlApplication>([]);
  displayedColumns: string[] = ['request_id', 'applicant_name', 'licence_type', 'created_at', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  sortBy: string = 'created_at';
  sortOrder: 'asc' | 'desc' = 'desc';
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadApplications();
  }

  ngAfterViewInit(): void {
    // Connect paginator to data source for UI updates
    this.dataSource.paginator = this.paginator;
    // Attach sort instance to data source for header arrows and accessibility
    this.dataSource.sort = this.sort;
    
    if (this.sort) {
      this.sort.sortChange.subscribe((event: Sort) => {
        this.pageIndex = 0;
        this.sortBy = this.mapSortBy(event.active);
        this.sortOrder = (event.direction as 'asc' | 'desc') || 'desc';
        this.loadApplications();
      });
    }
  }

  private loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const params = {
      page: this.pageIndex + 1,
      per_page: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder
    } as any;

    this.trackService.getApplications(params).subscribe({
      next: (response) => {
        console.log('Full API Response:', response); // Debug log
        console.log('Response structure:', {
          hasData: !!response.data,
          hasNestedData: !!response.data?.data,
          total: response.data?.total,
          perPage: response.data?.per_page,
          currentPage: response.data?.current_page
        });
        
        // Handle nested data structure like IDL request component
        const applications = response.data?.data || [];
        this.applications = applications;
        this.dataSource.data = this.applications;
        
        // Extract total count from API response - nested structure
        this.totalItems = response.data?.total || 0;
        // Sync paginator state with server response
        this.pageSize = Number(response.data?.per_page || 10);
        this.pageIndex = Math.max(0, (response.data?.current_page || 1) - 1);
        
        console.log('Final values:', {
          totalItems: this.totalItems,
          applicationsLength: this.applications.length,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load applications.';
        this.isLoading = false;
        console.error('Error loading applications:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadApplications();
  }

  private mapSortBy(active: string): string {
    switch (active) {
      case 'request_id':
        return 'code';
      case 'applicant_name':
        // Backend should support applicant_name (joined) sorting like IDL list
        return 'applicant_name';
      case 'licence_type':
        return 'license_type';
      case 'status':
        return 'overall_status';
      case 'created_at':
      default:
        return 'created_at';
    }
  }

  // Map backend numeric status to display text
  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Draft';
      case 1: return 'Pending Review';
      case 2: return 'In Review';
      case 3: return 'Approved';
      case 4: return 'Rejected';
      case 5: return 'Referred Back';
      case 6: return 'Generated';
      case 7: return 'Not Generated';
      case 8: return 'Paid';
      default: return 'Pending Review';
    }
  }

  // Return Tailwind utility classes for colored badges
  getStatusColor(statusText: string): string {
    switch (statusText) {
      case 'Draft':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
      case 'Pending Review':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-50';
      case 'In Review':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-50';
      case 'Approved':
        return 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-50';
      case 'Rejected':
        return 'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50';
      case 'Referred Back':
        return 'bg-orange-200 text-orange-800 dark:bg-orange-600 dark:text-orange-50';
      case 'Generated':
        return 'bg-purple-200 text-purple-800 dark:bg-purple-600 dark:text-purple-50';
      case 'Not Generated':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
      case 'Paid':
        return 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-50';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
    }
  }

  getApplicantName(application: IdlApplication): string {
    if (application.basic_information) {
      return `${application.basic_information.first_name} ${application.basic_information.last_name}`;
    }
    return 'N/A';
  }

  getLicenseType(application: IdlApplication): string {
    if (application.oman_license_information?.license_type) {
      return application.oman_license_information.license_type.license_type;
    }
    return 'N/A';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  navigateToHome() {
    this.router.navigate(['/']);
  }
}