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
import { HelperService } from 'src/app/shared/services/helper.service';

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
  private _helperService = inject(HelperService);

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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
      this.signUpForm.disable();
      this.authService.signup(this.signUpForm.value).subscribe({
        next: (response) => {
          this.openOtpVerifyModel(response.data?.otp);
        },
        error: (error) => {
          this.signUpForm.enable();
          this._helperService.openErrorSnackBar(error, '');
        }
      });
    } else {
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

  openOtpVerifyModel(otp: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
      data: {
        email: this.signUpForm.value.email,
        otp: otp
      }
    });
  }

  getPasswordError(): string {
    const passwordControl = this.signUpForm.get('password');
    
    if (!passwordControl?.touched) return '';
    
    if (passwordControl.hasError('required')) {
      return 'Password is required';
    }
    
    if (passwordControl.hasError('minlength')) {
      return 'Password must be at least 5 characters';
    }
    
    if (passwordControl.hasError('pattern')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    return '';
  }

}
