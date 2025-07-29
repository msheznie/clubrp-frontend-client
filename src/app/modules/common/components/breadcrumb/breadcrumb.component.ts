import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterModule,
    MatIconModule
  ]
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: { label: string; link?: string }[] = [];
}
