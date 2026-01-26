import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reference-sultanate-oman',
  templateUrl: './reference-sultanate-oman.component.html',
  styleUrls: ['./reference-sultanate-oman.component.scss'],
  standalone: true,
  imports: [
      MatButtonModule,
      MatExpansionModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      ReactiveFormsModule,
      CommonModule,
    ],
})
export class ReferenceSultanateOmanComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      firstReferenceName: ['', [Validators.required]],
      firstOfficeWork: [''],
      firstPoBoxNumber: [''],
      firstGsm: ['+968', [this.optionalPhoneValidator.bind(this)]],
      secondReferenceName: [''],
      secondOfficeWork: [''],
      secondPoBoxNumber: [''],
      secondGsm: ['+968', [this.optionalPhoneValidator.bind(this)]]
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

    optionalPhoneValidator(control: any): { [key: string]: any } | null {
    if (!control.value || control.value === '' || control.value === '+968') {
      return null; // Valid for optional fields
    }
    const pattern = /^\+[1-9]\d{5,14}$/;
    return pattern.test(control.value) ? null : { pattern: true };
  }

}
