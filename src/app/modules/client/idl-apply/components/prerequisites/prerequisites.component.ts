import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/shared/services/api.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-prerequisites',
  templateUrl: './prerequisites.component.html',
  styleUrls: ['./prerequisites.component.scss'],
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class PrerequisitesComponent implements OnInit {
  private api = inject(ApiService);
  private _helperService = inject(HelperService);
  prerequisites: any = {};

  ngOnInit() {
    this.loadPrerequisites();
  }

  loadPrerequisites() {
    this.api.get<any>('/idl/prerequisites').subscribe({
      next: (response) => {
        this.prerequisites = response.data;
      },
      error: (error) => {
        this._helperService.openErrorSnackBar(error, '');
      }
    });
  }
}
