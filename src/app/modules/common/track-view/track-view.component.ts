import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';

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
export class TrackViewComponent {
  isFirstDivVisible = true;

  breadcrumbs = [
    { label: 'Oman Automobile Association', link: '/association' },
    { label: 'Vehicle Transportation Permit', link: '/vehicle-transport' },
    { label: 'Track Update' }
  ];

  toggleDivs() {
    this.isFirstDivVisible = !this.isFirstDivVisible;
  }
}
