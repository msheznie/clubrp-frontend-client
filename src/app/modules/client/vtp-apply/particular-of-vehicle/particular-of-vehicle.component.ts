import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
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
import { IdlService } from '../../../../shared/services/idl.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-particular-of-vehicle',
  templateUrl: './particular-of-vehicle.component.html',
  standalone: true,
  styleUrls: ['./particular-of-vehicle.component.scss'],
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

export class ParticularOfVehicleComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  private idlService = inject(IdlService);
  readonly announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private destroy$ = new Subject<void>();
  vehicleTypes = signal<string[]>([]);
  vehicleTypeObjects = signal<any[]>([]); // Store full vehicle type objects with id and vehicle_name
  allCountries = signal<string[]>([]);
  
  selectedVehicleType: any = null;
  currentVehicleType = signal('');
  filteredVehicleTypes: any;

  selectedCountry: any = null;
  currentCountry = signal('');
  filteredCountries: any;

  ngOnInit(): void {
    this.initializeForm();
    this.getAssignmentDetails();
    this.getIdlFormData();

    // Setup filtered vehicle types computed signal
    this.filteredVehicleTypes = computed(() => {
      const currentVehicleType = this.currentVehicleType().toLowerCase();
      const vehicleTypeObjects = this.vehicleTypeObjects();
      return currentVehicleType
        ? vehicleTypeObjects.filter((vehicleType: any) => 
            (vehicleType.vehicle_name || '').toLowerCase().includes(currentVehicleType)
          )
        : vehicleTypeObjects.slice();
    });

    // Setup filtered countries computed signal
    this.filteredCountries = computed(() => {
      const currentCountry = this.currentCountry().toLowerCase();
      const countries = this.allCountries();
      return currentCountry
        ? countries.filter(country => country.toLowerCase().includes(currentCountry))
        : countries.slice();
    });

    // Initialize selected vehicle type from form if it exists
    // This will be set after vehicle types are loaded

    // Initialize selected country from form if it exists
    if (this.formGroup && this.formGroup.get('countryOfRegistration')?.value) {
      const existingCountry = this.formGroup.get('countryOfRegistration')?.value;
      if (existingCountry) {
        this.selectedCountry = { name: existingCountry };
      }
    }
  }

  getAssignmentDetails() {
    this.idlService.getVtpApplicationAssignmentDetails().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      const licenseMasters = response.data?.license_masters || [];
      // Store full objects with id and vehicle_name
      this.vehicleTypeObjects.set(licenseMasters);
      // Also store names for display
      const vehicleTypes = licenseMasters.map((vehicleType: any) => {
        return vehicleType.vehicle_name;
      });
      this.vehicleTypes.set(vehicleTypes);
      
      // Initialize selected vehicle type from form if it exists (after data is loaded)
      if (this.formGroup && this.formGroup.get('typeOfVehicle')?.value) {
        const existingVehicleTypeId = this.formGroup.get('typeOfVehicle')?.value;
        if (existingVehicleTypeId) {
          const matchedVehicle = licenseMasters.find((v: any) => v.id === existingVehicleTypeId);
          if (matchedVehicle) {
            this.selectedVehicleType = matchedVehicle;
          }
        }
      }
    });
  }

  getIdlFormData() {
    this.idlService.getIdlFormData().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      const countries = (response.data?.countryList || []).map((country: any) => {
        return country.name;
      });
      this.allCountries.set(countries);
    });
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      countryOfRegistration: ['', [Validators.required ]],
      registrationNumber: ['', [Validators.required, Validators.pattern('^[\\u0600-\\u06FFa-zA-Z0-9]+$')]],
      chassisNumber: ['', [Validators.required, Validators.pattern('^[\\u0600-\\u06FFa-zA-Z0-9]+$')]],
      engineNumber: ['', [Validators.required, Validators.pattern('^[\\u0600-\\u06FFa-zA-Z0-9]+$')]],
      numberOfCylinders: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      enginePowerCc: ['', [Validators.required]],
      typeOfVehicle: ['', Validators.required],
      exteriorColor: ['', [Validators.required]],
      interiorColor: ['', [Validators.required]],
      numberOfSeats: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      numberOfSpareTyres: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      makeOfRadioRecorder: [''],
      makeOfCar: ['', [Validators.required]],
      otherAccessories: [''],
      yearOfManufacture: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      weightInKg: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      presentValueRO: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  // Vehicle Type methods (single selection)
  addVehicleType(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value) {
      // Find matching vehicle type by name
      const matched = this.vehicleTypeObjects().find((v: any) => 
        (v.vehicle_name || '').toLowerCase() === value.toLowerCase()
      );
      if (matched) {
        this.selectedVehicleType = matched;
        if (this.formGroup) {
          this.formGroup.patchValue({
            typeOfVehicle: matched.id // Store the ID, not the name
          });
        }
      }
    }
    
    this.currentVehicleType.set('');
    
    if (event.input) {
      event.input.value = '';
    }
  }

  removeVehicleType(): void {
    if (this.selectedVehicleType) {
      this.announcer.announce(`Removed ${this.selectedVehicleType.vehicle_name || this.selectedVehicleType.name}`);
      this.selectedVehicleType = null;
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        typeOfVehicle: ''
      });
    }
  }

  selectedVehicleTypeOption(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option?.value; // This will be the full vehicle type object
    if (selected && selected.id) {
      this.selectedVehicleType = selected;
      this.currentVehicleType.set('');
      event.option.deselect();
      
      if (this.formGroup) {
        this.formGroup.patchValue({
          typeOfVehicle: selected.id // Store the ID, not the name
        });
      }
    }
  }

  onVehicleTypeInputChange(event: any): void {
    this.currentVehicleType.set(event.target.value);
  }

  openVehicleTypeAutocomplete(input: HTMLInputElement, autocomplete: any): void {
    input.focus();
    if (autocomplete && !autocomplete.isOpen) {
      autocomplete.openPanel();
    }
  }

  // Country methods (single selection)
  addCountry(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value) {
      this.selectedCountry = { name: value };
    }
    
    this.currentCountry.set('');
    
    if (event.input) {
      event.input.value = '';
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        countryOfRegistration: this.selectedCountry?.name || ''
      });
    }
  }

  removeCountry(): void {
    if (this.selectedCountry) {
      this.announcer.announce(`Removed ${this.selectedCountry.name}`);
      this.selectedCountry = null;
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        countryOfRegistration: ''
      });
    }
  }

  selectedCountryOption(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = event.option.viewValue;
    this.selectedCountry = { name: selectedCountry };
    this.currentCountry.set('');
    event.option.deselect();
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        countryOfRegistration: selectedCountry
      });
    }
  }

  onCountryInputChange(event: any): void {
    this.currentCountry.set(event.target.value);
  }

  openCountryAutocomplete(input: HTMLInputElement, autocomplete: any): void {
    input.focus();
    if (autocomplete && !autocomplete.isOpen) {
      autocomplete.openPanel();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
