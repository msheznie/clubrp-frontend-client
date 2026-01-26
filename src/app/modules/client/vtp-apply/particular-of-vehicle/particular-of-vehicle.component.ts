import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
})

export class ParticularOfVehicleComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
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

}
