import { Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class TermsAndConditionComponent implements OnInit, OnDestroy{
  @Input() formGroup!: FormGroup;
  private api = inject(ApiService);
  private _helperService = inject(HelperService);
  private destroy$ = new Subject<void>();
  termsAndCondition: any = {};

  ngOnInit() {
    this.loadTermsAndCondition();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadTermsAndCondition() {
    this.api.get<any>('/idl/terms-and-condition')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.termsAndCondition = response.data;
        },
        error: (error) => {
          this._helperService.openErrorSnackBar(error, '');
        }
      });
  }
}
