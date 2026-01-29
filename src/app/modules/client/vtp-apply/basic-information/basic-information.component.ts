import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdlService } from '../../../../shared/services/idl.service';



@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    CommonModule,
    MatAutocompleteModule,
  ],
})
export class BasicInformationComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }
  private idlService = inject(IdlService);

  selectedCountries: any[] = [];
  selectedNationality: any = null;
  readonly announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentCountry = signal('');
  currentNationality = signal('');
  allCountries = signal<string[]>([]);
  filteredCountries: any;
  filteredNationalities: any;
  private destroy$ = new Subject<void>();
  allnationalities = signal<string[]>([]);

  



  ngOnInit(): void {
    this.initializeForm();
    this.getIdlFormData()
    
    if (this.formGroup && this.formGroup.get('countriesToBeVisited')?.value) {
      const existingCountries = this.formGroup.get('countriesToBeVisited')?.value;
      if (Array.isArray(existingCountries)) {
        this.selectedCountries = existingCountries.map(country => ({ name: country }));
      }
    }

    this.filteredCountries = computed(() => {
      const currentCountry = this.currentCountry().toLowerCase();
      const countries = this.allCountries();
      return currentCountry
        ? countries.filter(country => country.toLowerCase().includes(currentCountry))
        : countries.slice();
    });

    // Setup filtered nationalities computed signal
    this.filteredNationalities = computed(() => {
      const currentNationality = this.currentNationality().toLowerCase();
      const nationalities = this.allnationalities();
      return currentNationality
        ? nationalities.filter(nationality => nationality.toLowerCase().includes(currentNationality))
        : nationalities.slice();
    });

    if (this.formGroup && this.formGroup.get('nationality')?.value) {
      const existingNationality = this.formGroup.get('nationality')?.value;
      if (existingNationality) {
        this.selectedNationality = { name: existingNationality };
      }
    }

  }

    getIdlFormData() {
    this.idlService.getIdlFormData().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      const countries = (response.data?.countryList || []).map((country: any) => {
        return country.name;
      });
      this.allCountries.set(countries);
      const nationalities = (response.data?.countryList || []).map((country: any) => {
    return country.nationality;
      });
      this.allnationalities.set(nationalities);
    });

  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      vehicleOwnerName: ['', [Validators.required]],
      driverName: ['', [Validators.required]],
      nationality: ['', Validators.required],
      idOrPassportNumber: ['', [Validators.required, Validators.pattern('^[\\u0600-\\u06FFa-zA-Z0-9]+$')]],
      countriesToBeVisited: [[], Validators.required],
      businessAddress: [''],
      residenceAddress: ['', Validators.required],
      poBoxNumber: [''],
      postalCode: [''],
      telBusiness: ['+968', [this.optionalPhoneValidator.bind(this)]],
      telResidence: ['+968', [Validators.required, Validators.pattern(/^\+[1-9]\d{5,14}$/)]],
      mobile: ['+968', [Validators.required, Validators.pattern(/^\+[1-9]\d{5,14}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  isFormValid(): boolean {
    return this.formGroup?.valid ?? false;
  }

    trackByIndex(index: number): number {
    return index;
  }

    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
  
      if (value && !this.selectedCountries.find(country => country.name === value)) {
        this.selectedCountries.push({ name: value });
      }
  
      this.currentCountry.set('');
      
      if (event.input) {
        event.input.value = '';
      }
      
      if (this.formGroup) {
        this.formGroup.patchValue({
          countriesToBeVisited: this.selectedCountries.map(country => country.name)
        });
      }
    }
  remove(country: any): void {
    const index = this.selectedCountries.indexOf(country);
    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
      this.announcer.announce(`Removed ${country.name}`);
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToBeVisited: this.selectedCountries.map(country => country.name)
      });
    }
  }

    selected(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = event.option.viewValue;
    if (!this.selectedCountries.find(country => country.name === selectedCountry)) {
      this.selectedCountries.push({ name: selectedCountry });
    }
    this.currentCountry.set('');
    event.option.deselect();
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToBeVisited: this.selectedCountries.map(country => country.name)
      });
    }
  }

    onChipInputChange(event: any): void {
    this.currentCountry.set(event.target.value);
  }

  addNationality(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value) {
      this.selectedNationality = { name: value };
    }
    
    this.currentNationality.set('');
    
    if (event.input) {
      event.input.value = '';
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        nationality: this.selectedNationality?.name || ''
      });
    }
  }

  removeNationality(): void {
    if (this.selectedNationality) {
      this.announcer.announce(`Removed ${this.selectedNationality.name}`);
      this.selectedNationality = null;
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        nationality: ''
      });
    }
  }

  selectedNationalityOption(event: MatAutocompleteSelectedEvent): void {
    const selectedNationality = event.option.viewValue;
    this.selectedNationality = { name: selectedNationality };
    this.currentNationality.set('');
    event.option.deselect();
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        nationality: selectedNationality
      });
    }
  }

  onNationalityInputChange(event: any): void {
    this.currentNationality.set(event.target.value);
  }

  openNationalityAutocomplete(input: HTMLInputElement, autocomplete: any): void {
    input.focus();
    if (autocomplete && !autocomplete.isOpen) {
      autocomplete.openPanel();
    }
  }

  openCountryAutocomplete(input: HTMLInputElement, autocomplete: any): void {
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
