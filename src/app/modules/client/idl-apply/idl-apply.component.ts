import { Component, inject, ViewChild } from '@angular/core';
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
export class IdlApplyComponent {
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private idlService = inject(IdlService);
  private _helperService = inject(HelperService);

  @ViewChild('steppe') stepper!: MatStepper;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    licenseType: ['1', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    otherName: [''],
    nationality: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
    poBox: [''],
    email: ['', [Validators.required, Validators.email]],
    gsm: ['', Validators.required],
    omaniLicenseNo: ['', Validators.required],
    firstIssueDate: ['', Validators.required],
    expiryDate: ['', Validators.required],
    licenseEligibility: ['', Validators.required],
    licenseTypeCategory: ['', Validators.required],
    countriesToVisit: [[]],
    documents: [[]],
    photo: [null]
  });
  threeFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  foreFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  fiveFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

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

    this.route.queryParams.subscribe((params) => {
      if (params['autoNext'] === 'true') {
        setTimeout(() => {
          this.moveToNextStep();
        }, 100);
      }
    });
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

  submitForm() {
    if (this.secondFormGroup.valid) {
      const formData = this.getApplicationFormData();
      this.idlService.submitIdlApplication(formData).subscribe({
        next: (response: any) => {
          this._helperService.openMessageSnackBar('Application submitted successfully!', '');
        },
        error: (error: any) => {
          this._helperService.openErrorMessageSnackBar(error, '');
        }
      });
    } else {
      this.markApplicationFormTouched();
      this._helperService.openErrorSnackBar('Please fill in all required fields correctly.', '');
    }
  }

  getApplicationFormData() {
    return {
      data: this.secondFormGroup.value,
      userId: this.authService.getUserId()
    };
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
