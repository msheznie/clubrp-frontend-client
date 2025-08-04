import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrl: './otp-verify.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatButtonModule,
  ],
})
export class OtpVerifyComponent {

  otpForm: FormGroup;
  submitted = false;
  isResending = false;
  email: string = '';
  otp: any = '';
  isExpire: boolean = false;
  timeLeft: number = 300;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OtpVerifyComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private _helperService: HelperService
  ) {
    console.log('Received OTP data:', data);  
    this.email = data.email;
    this.otp = data.otp;

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
      otp4: ['', [Validators.required]],
      otp5: ['', [Validators.required]],
      otp6: ['', [Validators.required]]
    });

    this.isExpire=false;
    this.timeLeft=300;
    this.startTimer();
  }

  onOtpInput(event: any, fieldIndex: number) {
    const input = event.target;
    const value = input.value;
    
    if (value && fieldIndex < 6) {
      const nextField = this.otpForm.get(`otp${fieldIndex + 1}`);
      if (nextField) {
        const nextInput = document.querySelector(`[formControlName="otp${fieldIndex + 1}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  onSubmit() {
    console.log('otpForm', this.otpForm.valid);
    if (this.otpForm.valid) {
      if(this.isExpire){
        this.otpForm.reset();
        this._helperService.openErrorSnackBar('OTP is expired. Please resend OTP', '');
        return;
      }
      this.submitted = true;
      
      const otpCode = Object.values(this.otpForm.value).join('');
      const otpCode2= Object.values(this.otp).join('');
      console.log('otpCode', otpCode);
      console.log('this.otp', this.otp);
      if(otpCode == otpCode2){
        console.log('otpCode == otpCode2');
        this.dialogRef.close({ success: true, data: otpCode });
      }
      else{
        this.submitted = false;
        this.otpForm.reset();
        this._helperService.openErrorSnackBar('Invalid OTP', '');
      }
    }
  }

  resendOtp() {
    this.isResending = true;
    
    this.authService.resendOtp({
      email: this.email
    }).subscribe({
      next: (response) => {
        console.log('OTP resent successfully:', response);
        this.otp = response.data?.otp;
        this.isExpire=false;
        this.timeLeft=300;
        this.startTimer();
        this.isResending = false;
        this._helperService.openMessageSnackBar('OTP resent successfully', '');
      },
      error: (error) => {
        console.error('Failed to resend OTP:', error);
        this._helperService.openErrorSnackBar('Failed to resend OTP', '');
        this.isResending = false;
      }
    });
  }

  startTimer() {
    setInterval(() => {
      if (this.timeLeft > 1) {
        this.timeLeft--;
      } else {
        this.isExpire=true
      }
    }, 1000);
  }
}
