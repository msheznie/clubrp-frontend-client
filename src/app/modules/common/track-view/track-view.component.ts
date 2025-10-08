import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { TrackService, IdlApplicationDetailsResponse } from '../../../shared/services/track.service';

@Component({
  selector: 'app-track-view',
  templateUrl: './track-view.component.html',
  styleUrls: ['./track-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NavbarComponent,
    BreadcrumbComponent,
    RouterModule
  ]
})
export class TrackViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private trackService = inject(TrackService);

  isFirstDivVisible = true;
  trackId?: string;
  trackData?: IdlApplicationDetailsResponse;
  isLoading = false;
  errorMessage = '';

  // Card expansion states
  isBasicInfoExpanded = false;
  isContactInfoExpanded = false;
  isLicenseInfoExpanded = false;
  isAttachmentsExpanded = false;
  isReviewExpanded = false;

  breadcrumbs = [
    { label: 'Oman Automobile Association', link: '/association' },
    { label: 'Vehicle Transportation Permit', link: '/vehicle-transport' },
    { label: 'Track Update' }
  ];

  ngOnInit(): void {
    this.trackId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.trackId) {
      this.fetchTrack(parseInt(this.trackId));
    }
  }

  toggleDivs() {
    this.isFirstDivVisible = !this.isFirstDivVisible;
  }

  toggleBasicInfo() {
    const nextState = !this.isBasicInfoExpanded;
    this.isBasicInfoExpanded = nextState;
    if (nextState) {
      this.isContactInfoExpanded = false;
      this.isLicenseInfoExpanded = false;
      this.isAttachmentsExpanded = false;
      this.isReviewExpanded = false;
    }
  }

  toggleContactInfo() {
    const nextState = !this.isContactInfoExpanded;
    this.isContactInfoExpanded = nextState;
    if (nextState) {
      this.isBasicInfoExpanded = false;
      this.isLicenseInfoExpanded = false;
      this.isAttachmentsExpanded = false;
      this.isReviewExpanded = false;
    }
  }

  toggleLicenseInfo() {
    const nextState = !this.isLicenseInfoExpanded;
    this.isLicenseInfoExpanded = nextState;
    if (nextState) {
      this.isBasicInfoExpanded = false;
      this.isContactInfoExpanded = false;
      this.isAttachmentsExpanded = false;
      this.isReviewExpanded = false;
    }
  }

  toggleAttachments() {
    const nextState = !this.isAttachmentsExpanded;
    this.isAttachmentsExpanded = nextState;
    if (nextState) {
      this.isBasicInfoExpanded = false;
      this.isContactInfoExpanded = false;
      this.isLicenseInfoExpanded = false;
      this.isReviewExpanded = false;
    }
  }

  toggleReview() {
    const nextState = !this.isReviewExpanded;
    this.isReviewExpanded = nextState;
    if (nextState) {
      this.isBasicInfoExpanded = false;
      this.isContactInfoExpanded = false;
      this.isLicenseInfoExpanded = false;
      this.isAttachmentsExpanded = false;
    }
  }

  private fetchTrack(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.trackService.getIdlApplicationDetails(id).subscribe({
      next: (data) => {
        this.trackData = data;
        this.isLoading = false;
        // auto-toggle UI section based on status
        this.isFirstDivVisible = data.data.idlApplication.overall_status !== 1; // 1 = Approved
      },
      error: () => {
        this.errorMessage = 'Failed to load track details.';
        this.isLoading = false;
      }
    });
  }

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

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'draft';
      case 1: return 'pending-review';
      case 2: return 'in-review';
      case 3: return 'approved';
      case 4: return 'rejected';
      case 5: return 'referred-back';
      case 6: return 'generated';
      case 7: return 'not-generated';
      case 8: return 'paid';
      default: return 'pending-review';
    }
  }

  getApplicantName(): string {
    if (this.trackData?.data.basic_information) {
      return `${this.trackData.data.basic_information.first_name} ${this.trackData.data.basic_information.last_name}`;
    }
    return 'N/A';
  }

  getLicenseType(): string {
    if (this.trackData?.data.oman_license_information?.license_type) {
      return this.trackData.data.oman_license_information.license_type.license_type;
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

  getFileIcon(fileType: string): string {
    if (!fileType) return 'assets/icons/attachment.png';
    
    const type = fileType.toLowerCase();
    switch (type) {
      case 'pdf':
        return 'assets/icons/pdf.png';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'assets/icons/attachment.png'; // Using attachment icon for images
      case 'doc':
      case 'docx':
        return 'assets/icons/attachment.png'; // Using attachment icon for documents
      case 'xls':
      case 'xlsx':
        return 'assets/icons/attachment.png'; // Using attachment icon for spreadsheets
      case 'mp3':
      case 'wav':
      case 'mp4':
      case 'avi':
        return 'assets/icons/attachment.png'; // Using attachment icon for media files
      default:
        return 'assets/icons/attachment.png'; // Using attachment icon as default
    }
  }

  hasRejectedAttachments(): boolean {
    if (!this.trackData?.data?.idlApplication?.attachments) return false;
    return this.trackData.data.idlApplication.attachments.some(att => att.status === 4);
  }
}
