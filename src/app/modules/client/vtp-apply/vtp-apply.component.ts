import { Component, inject, ViewChild } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe, CommonModule} from '@angular/common';
import { MaterialModules } from '../../../material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { NavbarComponent } from "../../common/components/navbar/navbar.component";
import { PrerequisitesComponent } from "./prerequisites/prerequisites.component";
import { BasicInformationComponent } from "./basic-information/basic-information.component";
import { ParticularOfVehicleComponent } from "./particular-of-vehicle/particular-of-vehicle.component";
import { OwnerAddressSultanateOfOmanComponent } from "./owner-address-sultanate-of-oman/owner-address-sultanate-of-oman.component";
import { OwnerAddressHomeCountryComponent } from "./owner-address-home-country/owner-address-home-country.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TermsAndConditionComponent } from "./terms-and-condition/terms-and-condition.component";
import { ApprovalsComponent } from "./approvals/approvals.component";
import { FeeAndChargersComponent } from "./fee-and-chargers/fee-and-chargers.component";
import { AttachmentsComponent } from "./attachments/attachments.component";
import { ReferenceSultanateOmanComponent } from "./reference-sultanate-oman/reference-sultanate-oman.component";
import { ReferencesYourHomeCountryComponent } from "./references-your-home-country/references-your-home-country.component";
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from "../../common/components/breadcrumb/breadcrumb.component";
import { MatDialog } from '@angular/material/dialog';
import { PaymentGatewayComponent } from '../idl-apply/components/payment-gateway/payment-gateway.component';
import { NgIf } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { SignInComponent } from '../../auth/sign-in/sign-in.component';

@Component({
  standalone: true,
  selector: 'app-vtp-apply',
  templateUrl: './vtp-apply.component.html',
  styleUrls: ['./vtp-apply.component.scss'],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    MaterialModules,
    NavbarComponent,
    PrerequisitesComponent,
    BasicInformationComponent,
    ParticularOfVehicleComponent,
    OwnerAddressSultanateOfOmanComponent,
    OwnerAddressHomeCountryComponent,
    TermsAndConditionComponent,
    ApprovalsComponent,
    FeeAndChargersComponent,
    AttachmentsComponent,
    ReferenceSultanateOmanComponent,
    ReferencesYourHomeCountryComponent,
    MatIconModule,
    BreadcrumbComponent,
    CommonModule,
    NgIf
  ],
})
export class VtpApplyComponent {
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);

  @ViewChild('steppe') stepper!: MatStepper;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
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
    { label: 'Vehicle Transportation Permit', link: '/vehicle-transport' },
    { label: 'Apply for VTP' },
  ];

  url: string =
    'https://www.figma.com/proto/q8AVbFD5QtnThuxROt9rZl/OAA---Oman-Automobile-Association?node-id=232-1183&t=YB1uGcm86pmjbI7T-1&scaling=contain&content-scaling=fixed&page-id=0%3A1';
  urlSafe: SafeResourceUrl | undefined;

  constructor(
    public sanitizer: DomSanitizer, 
    private newDialog: MatDialog,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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
        type: 'vtp'
      }
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
