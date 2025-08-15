import { Component, computed, inject, OnInit, signal, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatRadioModule,
} from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { IdlService } from '../../../../../shared/services/idl.service';

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
    MatRadioModule,
    MatSelectModule,
    NgFor,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgFor,
    CommonModule
  ],
})
export class BasicInformationComponent implements OnInit{
  @Input() formGroup!: FormGroup;
  private idlService = inject(IdlService);

  uploadedFiles: File[] = [];
  fileName: File[] = [];
  licenseMasters: any[] = [];
  documentList: any[] = [];
  selectedCountries: any[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentCountry = signal('');
  allCountries = signal<string[]>([]);
  filteredCountries: any;
  readonly announcer = inject(LiveAnnouncer);
  
  ngOnInit(): void {
    this.getIdlFormData();

    // Initialize selected countries from form if they exist
    if (this.formGroup && this.formGroup.get('countriesToVisit')?.value) {
      const existingCountries = this.formGroup.get('countriesToVisit')?.value;
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
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add country if it's not empty and not already selected
    if (value && !this.selectedCountries.find(country => country.name === value)) {
      this.selectedCountries.push({ name: value });
    }

    // Clear the input value
    this.currentCountry.set('');
    
    // Clear the input element
    if (event.input) {
      event.input.value = '';
    }
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToVisit: this.selectedCountries.map(country => country.name)
      });
    }
  }

  remove(country: any): void {
    const index = this.selectedCountries.indexOf(country);
    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
      this.announcer.announce(`Removed ${country.name}`);
    }
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToVisit: this.selectedCountries.map(country => country.name)
      });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = event.option.viewValue;
    if (!this.selectedCountries.find(country => country.name === selectedCountry)) {
      this.selectedCountries.push({ name: selectedCountry });
    }
    this.currentCountry.set('');
    event.option.deselect();
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToVisit: this.selectedCountries.map(country => country.name)
      });
    }
  }

  // Handle input value changes for chip input
  onChipInputChange(event: any): void {
    this.currentCountry.set(event.target.value);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      this.uploadedFiles.push(...filesArray);
      
      // Update form control
      if (this.formGroup) {
        this.formGroup.patchValue({
          documents: this.uploadedFiles
        });
      }
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        documents: this.uploadedFiles
      });
    }
  }

  getPhotoNames(): string {
    return this.fileName.map(file => file.name).join(', ');
  }
  
  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      this.fileName.push(...filesArray);
      
      // Update form control
      if (this.formGroup) {
        this.formGroup.patchValue({
          photo: this.fileName[0] // Assuming single photo
        });
      }
    }
  }

  getIdlFormData() {
    this.idlService.getIdlFormData().subscribe((response: any) => {
      this.licenseMasters = response.data.licenseMasters;
      this.documentList = response.data.documentList;
      const countries = response.data.countryList.map((country: any) => {
        return country.name;
      });
      this.allCountries.set(countries);
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formGroup?.get(controlName);
    return control ? control.hasError(errorType) && (control.touched || control.dirty) : false;
  }

  getEmailErrorMessage(): string {
    const emailControl = this.formGroup.get('email');
    
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    
    if (emailControl?.hasError('email') || emailControl?.hasError('pattern')) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }
}
