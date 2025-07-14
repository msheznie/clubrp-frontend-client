import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
      CommonModule
    ],
})
export class ApprovalsComponent {
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
        return 'bg-green-200 text-green-800';
      case 'In-Review':
        return 'bg-blue-200 text-blue-800';
      case 'Rejected':
        return 'bg-red-200 text-red-800';
      case 'Pending Review':
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
