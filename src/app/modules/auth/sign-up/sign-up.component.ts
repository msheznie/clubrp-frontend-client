import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MaterialModules } from '../../../material';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OtpVerifyComponent } from './otp-verify/otp-verify.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MaterialModules,
  ]
})
export class SignUpComponent {
  signUpForm: FormGroup;
  private dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      user_type: ['1'],
      primary_mobile: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{1,14}$/)]],
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/)
      ]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirm_password = form.get('confirm_password');
    
    if (password && confirm_password && password.value !== confirm_password.value) {
      confirm_password.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form submitted:', this.signUpForm.value);
      this.signUpForm.disable();
      this.authService.signup(this.signUpForm.value).subscribe({
        next: (response) => {
          this.openOtpVerifyModel();
          console.log('Signup successful:', response);
        },
        error: (error) => {
          this.signUpForm.enable();
          console.log('Signup failed:', error);
        }
      });
    } else {
      console.log('Form is invalid:', this.signUpForm.errors);
      this.markFormGroupTouched();
      return;
    }
  }

  // Mark all fields as touched to show validation errors
  markFormGroupTouched() {
    Object.keys(this.signUpForm.controls).forEach(key => {
      const control = this.signUpForm.get(key);
      control?.markAsTouched();
    });
  }

  openOtpVerifyModel() {
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
      });
  }

}
