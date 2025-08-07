import { Component, inject, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/shared/services/api.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-prerequisites',
  templateUrl: './prerequisites.component.html',
  styleUrls: ['./prerequisites.component.scss'],
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class PrerequisitesComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private _helperService = inject(HelperService);
  private destroy$ = new Subject<void>();
  prerequisites: any = {};

  ngOnInit() {
    this.loadPrerequisites();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPrerequisites() {
    this.api.get<any>('/idl/prerequisites')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.prerequisites = response.data;
        },
        error: (error) => {
          this._helperService.openErrorSnackBar(error, '');
        }
      });
  }
}
