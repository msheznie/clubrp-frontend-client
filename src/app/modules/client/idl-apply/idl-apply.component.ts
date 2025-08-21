import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModules } from '../../../material';
import { NavbarComponent } from '../../common/components/navbar/navbar.component';
import { PrerequisitesComponent } from './components/prerequisites/prerequisites.component';
import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { ApprovalsComponent } from './components/approvals/approvals.component';
import { FeeAndChargersComponent } from './components/fee-and-chargers/fee-and-chargers.component';
import { MatIconModule } from '@angular/material/icon';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { BreadcrumbComponent } from '../../common/components/breadcrumb/breadcrumb.component';
import { MatStepper } from '@angular/material/stepper';
import { SignInComponent } from '../../auth/sign-in/sign-in.component';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { IdlService } from '../../../shared/services/idl.service';
import { HelperService } from '../../../shared/services/helper.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-idl-apply',
  templateUrl: './idl-apply.component.html',
  styleUrls: ['./idl-apply.component.scss'],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    NgIf,
    MaterialModules,
    NavbarComponent,
    PrerequisitesComponent,
    BasicInformationComponent,
    TermsAndConditionComponent,
    ApprovalsComponent,
    FeeAndChargersComponent,
    PaymentGatewayComponent,
    BreadcrumbComponent,
    MatIconModule,
  ],
})
export class IdlApplyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private autoNextTimeoutId: number | null = null;
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private idlService = inject(IdlService);
  private _helperService = inject(HelperService);

  @ViewChild('steppe') stepper!: MatStepper;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    license_type: ['1', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    other_name: [''],
    nationality: ['', Validators.required],
    date_of_birth: ['', Validators.required],
    address: ['', Validators.required],
    postal_code: ['', Validators.required],
    po_box: [''],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    gsm: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{7,14}$/)]],
    oman_license_number: ['', Validators.required],
    first_issue_date: ['', Validators.required],
    expiry_date: ['', Validators.required],
    license_eligibility: ['', Validators.required],
    license_type_id: ['', Validators.required],
    countries_to_visit: [[] as string[]],
    documents: [[]],
    photo: [null],
    status: [0]
  });
  threeFormGroup = this._formBuilder.group({
    terms_and_conditions: [false, Validators.requiredTrue],
  });
  foreFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  fiveFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  isPhotoRequired: boolean = false;

  breadcrumbs = [
    { label: 'Oman Automobile Association', link: '/association' },
    { label: 'International Driving License', link: '/vehicle-transport' },
    { label: 'Apply for IDL' },
  ];

  url: string =
    'https://www.figma.com/proto/q8AVbFD5QtnThuxROt9rZl/OAA---Oman-Automobile-Association?node-id=232-1183&t=YB1uGcm86pmjbI7T-1&scaling=contain&content-scaling=fixed&page-id=0%3A1';
  urlSafe: SafeResourceUrl | undefined;

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private newDialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    this.route.queryParams
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      if (params['autoNext'] === 'true') {
        this.autoNextTimeoutId = window.setTimeout(() => this.moveToNextStep(), 100);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.autoNextTimeoutId !== null) clearTimeout(this.autoNextTimeoutId);
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLoginPage() {
    const dialogRef = this.dialog.open(SignInComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
      data: {
        type: 'idl'
      }
    });
  }

  checkFormValidity () {
    if (this.isPhotoRequired) {
      return this.secondFormGroup.valid && this.threeFormGroup.valid && this.secondFormGroup.get('photo')?.value && (this.secondFormGroup.get('countries_to_visit')?.value as string[])?.length > 0;
    } else {
      return this.secondFormGroup.valid && this.threeFormGroup.valid && (this.secondFormGroup.get('countries_to_visit')?.value as string[])?.length > 0;
    }
  }

  submitForm(type: string) {
    if (this.secondFormGroup.valid) {
      const formData = this.secondFormGroup.value;
      if (this.isPhotoRequired && !formData.photo) {
        this._helperService.openErrorSnackBar('Please upload a photo.', '');
        return;
      }
      if(!formData.countries_to_visit || formData.countries_to_visit.length === 0) {
        this._helperService.openErrorSnackBar('Please select at least one country to visit.', '');
        return;
      }
      if (type == 'submit') {
        formData.status = 1;
      }
      this.idlService.submitIdlApplication(formData).subscribe({
        next: (response: any) => {
          this._helperService.openMessageSnackBar('Application submitted successfully!', '');
        },
        error: (error: any) => {
          this._helperService.openErrorSnackBar(error, '');
        }
      });
    } else {
      this.markApplicationFormTouched();
      this._helperService.openErrorSnackBar('Please fill in all required fields correctly.', '');
    }
  }

  onPhotoRequiredChange(isPhotoRequired: boolean) {
    this.isPhotoRequired = isPhotoRequired;
  }

  markApplicationFormTouched() {
    Object.keys(this.secondFormGroup.controls).forEach(key => {
      const control = this.secondFormGroup.get(key);
      control?.markAsTouched();
    });
  }

  paySubmit() {
    const dialogRef = this.newDialog.open(PaymentGatewayComponent, {
      height: 'auto',
      width: '50em',
      panelClass: 'default-preview-dialog',
    });
  }

  moveToNextStep() {
    this.stepper.next();
  }

  isAuthenticated() { 
    return this.authService.isAuthenticated();
  }
}
