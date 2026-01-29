import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdlService } from '../../../../shared/services/idl.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        CommonModule,
      ],
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  private idlService = inject(IdlService);
  readonly announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private destroy$ = new Subject<void>();

  selectedDriver1Nationality: any = null;
  selectedDriver2Nationality: any = null;
  currentDriver1Nationality = signal('');
  currentDriver2Nationality = signal('');
  allnationalities = signal<string[]>([]);
  filteredDriver1Nationalities: any;
  filteredDriver2Nationalities: any;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getIdlFormData();

    this.filteredDriver1Nationalities = computed(() => {
      const currentNationality = this.currentDriver1Nationality().toLowerCase();
      const nationalities = this.allnationalities();
      return currentNationality
        ? nationalities.filter(nationality => nationality.toLowerCase().includes(currentNationality))
        : nationalities.slice();
    });

    this.filteredDriver2Nationalities = computed(() => {
      const currentNationality = this.currentDriver2Nationality().toLowerCase();
      const nationalities = this.allnationalities();
      return currentNationality
        ? nationalities.filter(nationality => nationality.toLowerCase().includes(currentNationality))
        : nationalities.slice();
    });

    if (this.formGroup && this.formGroup.get('driver1Nationality')?.value) {
      const existingNationality = this.formGroup.get('driver1Nationality')?.value;
      if (existingNationality) {
        this.selectedDriver1Nationality = { name: existingNationality };
      }
    }

    if (this.formGroup && this.formGroup.get('driver2Nationality')?.value) {
      const existingNationality = this.formGroup.get('driver2Nationality')?.value;
      if (existingNationality) {
        this.selectedDriver2Nationality = { name: existingNationality };
      }
    }
  }

  getIdlFormData() {
    this.idlService.getIdlFormData().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      const nationalities = (response.data?.countryList || []).map((country: any) => {
        return country.nationality;
      });
      this.allnationalities.set(nationalities);
    });
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      driver1Name: ['', [Validators.required]],
      driver1Id: ['', [Validators.required, Validators.pattern('^[\\u0600-\\u06FFa-zA-Z0-9]+$')]],
      driver1Nationality: ['', Validators.required],
      driver2Name: [''],
      driver2Id: [''],
      driver2Nationality: ['']
    });
  }

  isFormValid(): boolean {
    return this.formGroup?.valid ?? false;
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  addDriver1Nationality(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value) {
      this.selectedDriver1Nationality = { name: value };
    }
    
    this.currentDriver1Nationality.set('');
    
    if (event.input) {
      event.input.value = '';
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        driver1Nationality: this.selectedDriver1Nationality?.name || ''
      });
    }
  }

  removeDriver1Nationality(): void {
    if (this.selectedDriver1Nationality) {
      this.announcer.announce(`Removed ${this.selectedDriver1Nationality.name}`);
      this.selectedDriver1Nationality = null;
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        driver1Nationality: ''
      });
    }
  }

  selectedDriver1NationalityOption(event: MatAutocompleteSelectedEvent): void {
    const selectedNationality = event.option.viewValue;
    this.selectedDriver1Nationality = { name: selectedNationality };
    this.currentDriver1Nationality.set('');
    event.option.deselect();
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        driver1Nationality: selectedNationality
      });
    }
  }

  onDriver1NationalityInputChange(event: any): void {
    this.currentDriver1Nationality.set(event.target.value);
  }

  openDriver1NationalityAutocomplete(input: HTMLInputElement, autocomplete: any): void {
    input.focus();
    if (autocomplete && !autocomplete.isOpen) {
      autocomplete.openPanel();
    }
  }

  addDriver2Nationality(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value) {
      this.selectedDriver2Nationality = { name: value };
    }
    
    this.currentDriver2Nationality.set('');
    
    if (event.input) {
      event.input.value = '';
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        driver2Nationality: this.selectedDriver2Nationality?.name || ''
      });
    }
  }

  removeDriver2Nationality(): void {
    if (this.selectedDriver2Nationality) {
      this.announcer.announce(`Removed ${this.selectedDriver2Nationality.name}`);
      this.selectedDriver2Nationality = null;
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        driver2Nationality: ''
      });
    }
  }

  selectedDriver2NationalityOption(event: MatAutocompleteSelectedEvent): void {
    const selectedNationality = event.option.viewValue;
    this.selectedDriver2Nationality = { name: selectedNationality };
    this.currentDriver2Nationality.set('');
    event.option.deselect();
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        driver2Nationality: selectedNationality
      });
    }
  }

  onDriver2NationalityInputChange(event: any): void {
    this.currentDriver2Nationality.set(event.target.value);
  }

  openDriver2NationalityAutocomplete(input: HTMLInputElement, autocomplete: any): void {
    input.focus();
    if (autocomplete && !autocomplete.isOpen) {
      autocomplete.openPanel();
    }
  }

  optionalPhoneValidator(control: any): { [key: string]: any } | null {
    if (!control.value || control.value === '' || control.value === '+968') {
      return null; 
    }
    const pattern = /^\+[1-9]\d{5,14}$/;
    return pattern.test(control.value) ? null : { pattern: true };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
