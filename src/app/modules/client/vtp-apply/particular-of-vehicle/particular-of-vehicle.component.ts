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
  
  selectedVehicleType: any = null;
  currentVehicleType = signal('');
  filteredVehicleTypes: any;

  ngOnInit(): void {
    this.initializeForm();
    this.getAssignmentDetails();

    // Setup filtered vehicle types computed signal
    this.filteredVehicleTypes = computed(() => {
      const currentVehicleType = this.currentVehicleType().toLowerCase();
      const vehicleTypes = this.vehicleTypes();
      return currentVehicleType
        ? vehicleTypes.filter(vehicleType => vehicleType.toLowerCase().includes(currentVehicleType))
        : vehicleTypes.slice();
    });

    // Initialize selected vehicle type from form if it exists
    if (this.formGroup && this.formGroup.get('typeOfVehicle')?.value) {
      const existingVehicleType = this.formGroup.get('typeOfVehicle')?.value;
      if (existingVehicleType) {
        this.selectedVehicleType = { name: existingVehicleType };
      }
    }
  }

      getAssignmentDetails() {
      this.idlService.getVtpApplicationAssignmentDetails().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
        const vehicleTypes = (response.data?.license_masters || []).map((vehicleType: any) => {
          return vehicleType.vehicle_name;
        });
        this.vehicleTypes.set(vehicleTypes);
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
      this.selectedVehicleType = { name: value };
    }
    
    this.currentVehicleType.set('');
    
    if (event.input) {
      event.input.value = '';
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        typeOfVehicle: this.selectedVehicleType?.name || ''
      });
    }
  }

  removeVehicleType(): void {
    if (this.selectedVehicleType) {
      this.announcer.announce(`Removed ${this.selectedVehicleType.name}`);
      this.selectedVehicleType = null;
    }
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        typeOfVehicle: ''
      });
    }
  }

  selectedVehicleTypeOption(event: MatAutocompleteSelectedEvent): void {
    const selectedVehicleType = event.option.viewValue;
    this.selectedVehicleType = { name: selectedVehicleType };
    this.currentVehicleType.set('');
    event.option.deselect();
    
    if (this.formGroup) {
      this.formGroup.patchValue({
        typeOfVehicle: selectedVehicleType
      });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
