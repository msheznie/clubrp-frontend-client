import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule 
  ]
})
export class SignInComponent implements OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  private dialog = inject(MatDialog);
  private _helperService = inject(HelperService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.loginForm.disable();

      this.authService.login(this.loginForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.dialog.closeAll();
            this.router.navigate(['/idl-apply'], {
              queryParams: { autoNext: 'true' }
            });
          },
          error: (error) => {
            this.submitted = false;
            this.loginForm.enable();
            this._helperService.openErrorSnackBar(error, '');
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  loginWithGoogle() {
    // Implement Google OAuth login
    this._helperService.openMessageSnackBar('Google login functionality coming soon!', '');
  }

  openSignup() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(SignUpComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
    });
  }
}
