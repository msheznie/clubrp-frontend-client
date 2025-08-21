import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BasicInformationComponent } from "../basic-information/basic-information.component";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
    standalone: true,
    imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    BasicInformationComponent
],
})
export class ApprovalsComponent {
  @Input() formGroup!: FormGroup;
  
  documents = [
    { label: 'Basic Information', status: 'Approved', icon: 'assets/icons/basic-info.png' },
    { label: 'Particular Of Vehicle', status: 'Approved', icon: 'assets/icons/vehicle.png' },
    { label: 'Owner’s Address In Sultanate Of Oman', status: 'In-Review', icon: 'assets/icons/address-oman.png' },
    { label: 'Owner’s Address In His Home Country', status: 'Rejected', icon: 'assets/icons/address-home.png' },
    { label: 'References In Sultanate Of Oman', status: 'Pending Review', icon: 'assets/icons/references-oman.png' },
    { label: 'References In Your Home Country', status: 'Pending Review', icon: 'assets/icons/references-home.png' },
    { label: 'Attachments', status: 'Pending Review', icon: 'assets/icons/attachments.png' }
  ];

  statusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'status-badge approved';
      case 'In-Review':
        return 'status-badge in-review';
      case 'Rejected':
        return 'status-badge rejected';
      case 'Pending Review':
        return 'status-badge pending-review';
      default:
        return 'status-badge pending-review';
    }
  }
}
