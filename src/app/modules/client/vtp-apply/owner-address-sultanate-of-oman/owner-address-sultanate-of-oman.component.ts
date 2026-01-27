import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdlService } from '../../../../shared/services/idl.service';

@Component({
  selector: 'app-owner-address-sultanate-of-oman',
  templateUrl: './owner-address-sultanate-of-oman.component.html',
  styleUrls: ['./owner-address-sultanate-of-oman.component.scss'],
  standalone: true,
  imports: [
      MatButtonModule,
      MatExpansionModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatAutocompleteModule,
      ReactiveFormsModule,
      CommonModule,
    ],
})
export class OwnerAddressSultanateOfOmanComponent implements OnInit {
  formGroup: FormGroup;
  private idlService = inject(IdlService);
  private destroy$ = new Subject<void>();

  allCountries = signal<string[]>([]);
  currentResidenceCountry = signal('');
  filteredResidenceCountries = computed(() => {
    const current = this.currentResidenceCountry().toLowerCase();
    const countries = this.allCountries();
    return current
      ? countries.filter(c => c.toLowerCase().includes(current))
      : countries.slice();
  });

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getIdlFormData();
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      officeWork: [''],
      residenceCountry: ['', Validators.required],
      poBoxNumberOwner: [''],
      postalCode: [''],
      telNoBusiness: ['+968', [this.optionalPhoneValidator.bind(this)]],
      residenceCity: ['', [Validators.required]],
      gsm: ['+968', [this.optionalPhoneValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private getIdlFormData(): void {
    this.idlService.getIdlFormData().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      const countries = (response.data?.countryList || []).map((country: any) => country.name).filter(Boolean);
      this.allCountries.set(countries);
    });
  }

  onResidenceCountryInputChange(event: any): void {
    this.currentResidenceCountry.set(event.target.value);
  }

  selectedResidenceCountryOption(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = event.option.viewValue;
    this.currentResidenceCountry.set('');
    event.option.deselect();
    this.formGroup.patchValue({ residenceCountry: selectedCountry });
  }
  
  isFormValid(): boolean {
    return this.formGroup?.valid ?? false;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
