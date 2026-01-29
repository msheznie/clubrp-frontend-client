import { Component, inject, ViewChild } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BreadcrumbComponent } from "../../common/components/breadcrumb/breadcrumb.component";
import { MatDialog } from '@angular/material/dialog';
import { PaymentGatewayComponent } from '../idl-apply/components/payment-gateway/payment-gateway.component';
import { NgIf } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { SignInComponent } from '../../auth/sign-in/sign-in.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { VtpService } from '../../../shared/services/vtp.service';
import { HelperService } from '../../../shared/services/helper.service';

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
    DriverDetailsComponent,
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
    MatCheckboxModule,
    BreadcrumbComponent,
    CommonModule,
    NgIf
  ],
})
export class VtpApplyComponent {
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private vtpService = inject(VtpService);
  private helperService = inject(HelperService);

  @ViewChild('steppe') stepper!: MatStepper;
  
  // ViewChild references to access child component forms
  @ViewChild(BasicInformationComponent) basicInformationComponent!: BasicInformationComponent;
  @ViewChild(DriverDetailsComponent) driverDetailsComponent!: DriverDetailsComponent;
  @ViewChild(ParticularOfVehicleComponent) particularOfVehicleComponent!: ParticularOfVehicleComponent;
  @ViewChild(OwnerAddressSultanateOfOmanComponent) ownerAddressComponent!: OwnerAddressSultanateOfOmanComponent;
  @ViewChild(ReferencesYourHomeCountryComponent) referencesHomeCountryComponent!: ReferencesYourHomeCountryComponent;
  @ViewChild(ReferenceSultanateOmanComponent) referenceSultanateOmanComponent!: ReferenceSultanateOmanComponent;
  @ViewChild(AttachmentsComponent) attachmentsComponent!: AttachmentsComponent;
  @ViewChild(TermsAndConditionComponent) termsAndConditionComponent!: TermsAndConditionComponent;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
    isMulkiyaTranslationRequired: [false],
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
    { label: 'Carnte De Passage', link: '/vehicle-transport' },
    { label: 'Apply for CDP' },
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

  submitApplication(overall_status: number = 0): void {
    if (!this.validateAllForms()) {
      const hasAttachments = (this.attachmentsComponent?.getAttachments()?.length ?? 0) > 0;
      const message = !hasAttachments
        ? 'At least one attachment is required to submit the application'
        : 'Please fill all required fields before submitting.';
      console.error('Validation failed:', message);
      this.helperService.openErrorSnackBar(message, '');
      return;
    }

    const combinedForm = this.createCombinedFormGroup(overall_status);
    const payload = this.buildPayloadFromFormGroup(combinedForm);

    this.vtpService.submitVtpApplication(payload).subscribe({
      next: (response: any) => {
        this.helperService.openMessageSnackBar('Application submitted successfully!', '');
        this.router.navigate(['/track'], { queryParams: { application_type: '2' } });
      },
      error: (error: any) => {
        console.error('Error submitting application:', error);
        this.helperService.openErrorSnackBar(error, '');
      }
    });
  }

  private validateAllForms(): boolean {
    const hasAttachments = (this.attachmentsComponent?.getAttachments()?.length ?? 0) > 0;
    const validationResults: any = {
      basicInformation: this.validateForm('Basic Information', this.basicInformationComponent?.formGroup),
      driverDetails: this.validateForm('Driver Details', this.driverDetailsComponent?.formGroup),
      vehicleParticulars: this.validateForm('Vehicle Particulars', this.particularOfVehicleComponent?.formGroup),
      ownerAddress: this.validateForm('Owner Address', this.ownerAddressComponent?.formGroup),
      referencesHomeCountry: this.validateForm('References (Home Country)', this.referencesHomeCountryComponent?.formGroup),
      referenceOman: this.validateForm('References (Oman)', this.referenceSultanateOmanComponent?.formGroup),
      attachments: hasAttachments,
      termsAccepted: this.termsAndConditionComponent?.accepted ?? false
    };

    const invalidForms: string[] = [];
    Object.keys(validationResults).forEach((key) => {
      if (key === 'termsAccepted') {
        if (!validationResults[key]) {
          invalidForms.push('Terms & Conditions (not accepted)');
        }
      } else if (key === 'attachments') {
        if (!validationResults[key]) {
          invalidForms.push('At least one attachment is required to submit the application');
        }
      } else if (validationResults[key] && !validationResults[key].isValid) {
        invalidForms.push(`${validationResults[key].formName}: ${validationResults[key].invalidFields.join(', ')}`);
      }
    });

    if (invalidForms.length > 0) {
      console.error('Validation failed. Invalid/empty fields:', invalidForms);
      console.log('Detailed validation results:', validationResults);
    }

    const allValid = Object.values(validationResults).every((result: any) => {
      if (typeof result === 'boolean') {
        return result;
      }
      return result?.isValid ?? false;
    });

    return allValid;
  }

  private validateForm(formName: string, formGroup: FormGroup | undefined): { isValid: boolean; formName: string; invalidFields: string[] } {
    if (!formGroup) {
      return { isValid: false, formName, invalidFields: ['Form not initialized'] };
    }

    const invalidFields: string[] = [];
    
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control && control.invalid) {
        invalidFields.push(key);
      }
    });

    return {
      isValid: formGroup.valid,
      formName,
      invalidFields
    };
  }


  private createCombinedFormGroup(overall_status: number = 0): FormGroup {
    const basicInfoValue = this.basicInformationComponent?.formGroup?.value || {};
    const driverDetailsValue = this.driverDetailsComponent?.formGroup?.value || {};
    const vehicleParticularsValue = this.particularOfVehicleComponent?.formGroup?.value || {};
    const ownerAddressValue = this.ownerAddressComponent?.formGroup?.value || {};
    const referencesHomeCountryValue = this.referencesHomeCountryComponent?.formGroup?.value || {};
    const referenceOmanValue = this.referenceSultanateOmanComponent?.formGroup?.value || {};
    const termsAccepted = this.termsAndConditionComponent?.accepted || false;
    const isMulkiyaTranslationRequired = (this.secondFormGroup.get('isMulkiyaTranslationRequired')?.value ?? false) ? 1 : 0;

    let vehicleParticularsProcessed = { ...vehicleParticularsValue };
    if (vehicleParticularsProcessed.typeOfVehicle && !vehicleParticularsProcessed.vehicle_license_type) {
      vehicleParticularsProcessed.vehicle_license_type = vehicleParticularsProcessed.typeOfVehicle;
      delete vehicleParticularsProcessed.typeOfVehicle;
    } else if (!vehicleParticularsProcessed.typeOfVehicle && !vehicleParticularsProcessed.vehicle_license_type) {
      delete vehicleParticularsProcessed.vehicle_license_type;
      delete vehicleParticularsProcessed.typeOfVehicle;
    }

    const attachments = this.processAttachments();

    return this._formBuilder.group({
      applicant_name: basicInfoValue.vehicleOwnerName || '',
      application_type: 'VTP', // Default application type
      status: 1, // Default status
      overall_status: overall_status, // Draft status
      isMulkiyaTranslationRequired,

      basic_information: basicInfoValue,
      driver_details: driverDetailsValue,
      vehicle_particulars: vehicleParticularsProcessed,
      owner_address: ownerAddressValue,
      references: referencesHomeCountryValue,
      oman_references: referenceOmanValue,
      attachments: attachments,
      terms_accepted: termsAccepted,
      approvals: {},
      fees: {},
      is_auto_approval: false,
      is_rop_integrated: 0,
      crud_type: 'C', // Create
      parent_id: null
    });
  }

  private processAttachments(): any[] {
    return this.attachmentsComponent?.getAttachments() ?? [];
  }

  private buildPayloadFromFormGroup(formGroup: FormGroup): FormData | any {
    const formValue = formGroup.value;

    const rawAttachments = this.attachmentsComponent?.getAttachments() ?? [];
    const attachmentsFromControl = Array.isArray(rawAttachments) ? rawAttachments : [];

    const hasFileObjects = attachmentsFromControl.length > 0 &&
      attachmentsFromControl.some((att: any) => att && att.attachment instanceof File);

    let attachments: any[] = [];
    if (attachmentsFromControl.length > 0) {
      attachments = attachmentsFromControl.map((attachment: any) => {
        const file = attachment.attachment instanceof File ? attachment.attachment : null;
        return {
          ...attachment,
          document_type: attachment.document_type || 'ATTACHMENT',
          file_type: attachment.file_type || (file ? file.type : ''),
          file_size: attachment.file_size ?? (file ? file.size : 0),
          file_name: attachment.file_name || (file ? file.name : 'file'),
          name: attachment.file_name || (file ? file.name : 'attachment'),
          attachment: file ?? (attachment.attachment || attachment.file_path || null),
          attachment_type: attachment.attachment_type || null,
          expire_on: attachment.expire_on || null,
          id: attachment.id || null,
          vtp_attachment_id: attachment.vtp_attachment_id || null
        };
      });
    }

    const cleanPayload: any = { ...formValue };
    
    if (cleanPayload.vehicle_particulars && typeof cleanPayload.vehicle_particulars === 'object') {
      const vp = cleanPayload.vehicle_particulars;
      if (!vp.vehicle_license_type && vp.typeOfVehicle) {
        vp.vehicle_license_type = vp.typeOfVehicle;
        delete vp.typeOfVehicle;
      }
    }

    cleanPayload.attachments = attachments;

    if (hasFileObjects) {
      const formData = new FormData();
      
      Object.keys(cleanPayload).forEach((key) => {
        if (key === 'attachments') {
          return; // Handle attachments separately
        }
        
        const value = cleanPayload[key];
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value).forEach((nestedKey) => {
              const nestedValue = value[nestedKey];
              if (nestedValue !== undefined && nestedValue !== null) {
                formData.append(`${key}[${nestedKey}]`, String(nestedValue));
              }
            });
          } else if (Array.isArray(value)) {
            // Handle arrays
            value.forEach((item, index) => {
              if (typeof item === 'object') {
                Object.keys(item).forEach((itemKey) => {
                  formData.append(`${key}[${index}][${itemKey}]`, String(item[itemKey] || ''));
                });
              } else {
                formData.append(`${key}[${index}]`, String(item));
              }
            });
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      attachments.forEach((attachment, index) => {
        const file = attachment.attachment instanceof File ? attachment.attachment : null;
        if (file) {
          formData.append(`attachments[${index}]`, file, attachment.file_name || file.name);
        }
        formData.append(`attachments[${index}][file_type]`, attachment.file_type || '');
        formData.append(`attachments[${index}][name]`, attachment.name || attachment.file_name || 'attachment');
        formData.append(`attachments[${index}][size]`, String(attachment.file_size ?? 0));
        if (attachment.modifiedDate != null) {
          formData.append(`attachments[${index}][modifiedDate]`, String(attachment.modifiedDate));
        }
      });
      
      return formData;
    }

    return cleanPayload;
  }
}
