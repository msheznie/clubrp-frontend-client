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
import { ApiService } from '../../../../../shared/services/api.service';
import { CommonModule } from '@angular/common';

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

  private api = inject(ApiService);
  uploadedFiles: File[] = [];
  fileName: File[] = [];
  
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentFruit = signal('');
  readonly fruits = signal(['Lemon']);
  readonly allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  readonly filteredFruits = computed(() => {
    const currentFruit = this.currentFruit().toLowerCase();
    return currentFruit
      ? this.allFruits.filter(fruit => fruit.toLowerCase().includes(currentFruit))
      : this.allFruits.slice();
  });

  readonly announcer = inject(LiveAnnouncer);
  
  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.update(fruits => [...fruits, value]);
    }

    // Clear the input value
    this.currentFruit.set('');
    
    // Clear the input element
    if (event.input) {
      event.input.value = '';
    }
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToVisit: this.fruits()
      });
    }
  }

  remove(fruit: string): void {
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
      return [...fruits];
    });
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToVisit: this.fruits()
      });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.update(fruits => [...fruits, event.option.viewValue]);
    this.currentFruit.set('');
    event.option.deselect();
    
    // Update form control
    if (this.formGroup) {
      this.formGroup.patchValue({
        countriesToVisit: this.fruits()
      });
    }
  }

  // Handle input value changes for chip input
  onChipInputChange(event: any): void {
    this.currentFruit.set(event.target.value);
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
  
}
