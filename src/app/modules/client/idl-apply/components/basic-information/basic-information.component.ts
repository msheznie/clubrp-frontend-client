import { Component, computed, inject, OnInit, OnDestroy, signal, Input, Output, EventEmitter } from '@angular/core';
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
import { HelperService } from '../../../../../shared/services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

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
export class BasicInformationComponent implements OnInit, OnDestroy{
  @Input() formGroup!: FormGroup;
  @Output() photoRequiredChange = new EventEmitter<boolean>();
  private _helperService = inject(HelperService);
  private idlService = inject(IdlService);
  private auth = inject(AuthService);

  uploadedFiles: File[] = [];
  fileName: File[] = [];
  licenseMasters: any[] = [];
  documentList: any[] = [];
  selectedCountries: any[] = [];
  photoPreviewUrl: string | null = null;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentCountry = signal('');
  allCountries = signal<string[]>([]);
  filteredCountries: any;
  selectedFiles?: any = [];
  isPhotoRequired: boolean = false;
  initialUpdatedFiles: any = [];
  imageNonAllowedTypes: string[] = ['ace', 'ade', 'adp', 'ani', 'app', 'asp', 'aspx', 'asx', 'bas', 'bat', 'cla', 'cer', 'chm', 'cmd', 'cnt', 'com',
    'cpl', 'crt', 'csh', 'class', 'der', 'docm', 'exe', 'fxp', 'gadget', 'hlp', 'hpj', 'hta', 'htc', 'inf', 'ins', 'isp', 'its', 'jar',
    'js', 'jse', 'ksh', 'lnk', 'mad', 'maf', 'mag', 'mam', 'maq', 'mar', 'mas', 'mat', 'mau', 'mav', 'maw', 'mda', 'mdb', 'mde', 'mdt',
    'mdw', 'mdz', 'mht', 'mhtml', 'msc', 'msh', 'msh1', 'msh1xml', 'msh2', 'msh2xml', 'mshxml', 'msi', 'msp', 'mst', 'ops', 'osd',
    'ocx', 'pl', 'pcd', 'pif', 'plg', 'prf', 'prg', 'ps1', 'ps1xml', 'ps2', 'ps2xml', 'psc1', 'psc2', 'pst', 'reg', 'scf', 'scr',
    'sct', 'shb', 'shs', 'tmp', 'url', 'vb', 'vbe', 'vbp', 'vbs', 'vsmacros', 'vss', 'vst', 'vsw', 'ws', 'wsc', 'wsf', 'wsh', 'xml',
    'xbap', 'xnk', 'php'];
  
  imageAllowedTypes: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'ico', 'webp'];
  readonly announcer = inject(LiveAnnouncer);
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.getIdlFormData();
    }

    // Initialize selected countries from form if they exist
    if (this.formGroup && this.formGroup.get('countries_to_visit')?.value) {
      const existingCountries = this.formGroup.get('countries_to_visit')?.value;
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

    const existingPhoto = this.formGroup.get('photo')?.value;
    this.photoPreviewUrl = existingPhoto?.attachment || null;
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
        countries_to_visit: this.selectedCountries.map(country => country.name)
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
        countries_to_visit: this.selectedCountries.map(country => country.name)
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
        countries_to_visit: this.selectedCountries.map(country => country.name)
      });
    }
  }

  // Handle input value changes for chip input
  onChipInputChange(event: any): void {
    this.currentCountry.set(event.target.value);
  }

  onFilesSelected(event: any): void {
    this.initialUpdatedFiles = event.target.files;
    var filteredFiles: any = []

    if (this.initialUpdatedFiles && this.initialUpdatedFiles[0]) {
      for (let i = 0; i < this.initialUpdatedFiles.length; ++i) {
        const reader = new FileReader();
        const file = this.initialUpdatedFiles[i];
        const parts = file.name.split('.');
        const size = file.size / 1000000;
        const type = parts[parts.length - 1];

        if (size > 10) {
          this._helperService.openErrorSnackBar(file.name + ' ' + 'File size exceeded', '');
        } else if (size < 2) {
          this._helperService.openErrorSnackBar(file.name + ' ' + 'File size is too small', '');
        } else if (this.imageNonAllowedTypes.includes(type)) {
          this._helperService.openErrorSnackBar(file.name + ' ' + 'File type not supported', '');
        }
        if (size <= 10 && size >= 2 && !this.imageNonAllowedTypes.includes(type)) {
          filteredFiles.push(this.initialUpdatedFiles[i])
        }
        this.initialUpdatedFiles[i]['document_type'] = 'ATTACHMENT'
        this.initialUpdatedFiles[i]['file_type'] = type
        this.initialUpdatedFiles[i]['file_size'] = file.size
        this.initialUpdatedFiles[i]['file_name'] = file.name
        this.initialUpdatedFiles[i]['modifiedDate'] = file.lastModified
        this.initialUpdatedFiles[i]['expire_on'] = null
        this.initialUpdatedFiles[i]['updated_at'] = new Date()
        this.initialUpdatedFiles[i]['attachment_type'] = null
        reader.onload = (event: any) => {
          if (this.initialUpdatedFiles[i]) {
            this.initialUpdatedFiles[i]['attachment'] = event.target.result;
          }
        };

        reader.readAsDataURL(file);
      }
    }

    this.initialUpdatedFiles = filteredFiles;
    this.selectedFiles = Array.from(this.selectedFiles).concat(Array.from(this.initialUpdatedFiles));

    if (this.formGroup) {
      this.formGroup.patchValue({
        documents: this.selectedFiles
      });
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);

    if (this.formGroup) {
      this.formGroup.patchValue({
        documents: this.selectedFiles
      });
    }
  }

  getPhotoName(): string {
    return this.formGroup.get('photo')?.value?.file_name || '';
  }
  
  uploadPhoto(event: any): void {
    const input = event.target.files[0];
    if (input) {
      const reader = new FileReader();
      const file = input;
      const parts = file.name.split('.');
      const size = file.size / 1000000;
      const type = parts[parts.length - 1];

      if (size > 2) {
        this._helperService.openErrorSnackBar(file.name + ' ' + 'File size exceeded', '');
      } else if (!this.imageAllowedTypes.includes(type)) {
        this._helperService.openErrorSnackBar(file.name + ' ' + 'File type not supported', '');
      }
      if (size <= 2 && this.imageAllowedTypes.includes(type)) {
        input['document_type'] = 'ATTACHMENT'
        input['file_type'] = type
        input['file_size'] = file.size
        input['file_name'] = file.name
        input['modifiedDate'] = file.lastModified
        input['expire_on'] = null
        input['updated_at'] = new Date()
        input['attachment_type'] = 3

        reader.onload = (event: any) => {
          const dataUrl = event.target.result as string;
          this.photoPreviewUrl = dataUrl;  
          input['attachment'] = dataUrl;
          this.formGroup.patchValue({ photo: input });
        };
  
        reader.readAsDataURL(file);
      }
    }
  }

  getIdlFormData() {
    this.idlService.getIdlFormData().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      this.licenseMasters = response.data?.licenseMasters || [];
      const documents = response.data?.documentList?.details || [];
      const photoDocument = documents.find((document: any) => document.attachment_type == 3);
      this.isPhotoRequired = photoDocument && photoDocument.is_mandatory == 1 ? true : false;
      this.documentList = documents.filter((document: any) => document.attachment_type != 3);
      this.photoRequiredChange.emit(this.isPhotoRequired);
      const countries = (response.data?.countryList || []).map((country: any) => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
