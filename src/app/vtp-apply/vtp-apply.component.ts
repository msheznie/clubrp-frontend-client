import { Component, inject } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import { MaterialModules } from '../material';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { TermsAndConditionsComponent } from "./components/terms-and-conditions/terms-and-conditions.component";
import { BasicInformationComponent } from "./components/basic-information/basic-information.component";
import { ParticularOfVehicleComponent } from "./components/particular-of-vehicle/particular-of-vehicle.component";
import { OwnerAddressSultanateOfOmanComponent } from "./components/owner-address-sultanate-of-oman/owner-address-sultanate-of-oman.component";
import { OwnerAddressHomeCountryComponent } from "./components/owner-address-home-country/owner-address-home-country.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TermsAndConditionComponent } from "./components/terms-and-condition/terms-and-condition.component";
import { ApprovalsComponent } from "./components/approvals/approvals.component";
import { FeeAndChargersComponent } from "./components/fee-and-chargers/fee-and-chargers.component";
import { AttachmentsComponent } from "./components/attachments/attachments.component";
import { ReferenceSultanateOmanComponent } from "./components/reference-sultanate-oman/reference-sultanate-oman.component";
import { ReferencesYourHomeCountryComponent } from "./components/references-your-home-country/references-your-home-country.component";
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
    TermsAndConditionsComponent,
    BasicInformationComponent,
    ParticularOfVehicleComponent,
    OwnerAddressSultanateOfOmanComponent,
    OwnerAddressHomeCountryComponent,
    TermsAndConditionComponent,
    ApprovalsComponent,
    FeeAndChargersComponent,
    AttachmentsComponent,
    ReferenceSultanateOmanComponent,
    ReferencesYourHomeCountryComponent
],
})
export class VtpApplyComponent {
  private _formBuilder = inject(FormBuilder);

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


  url: string = 'https://www.figma.com/proto/q8AVbFD5QtnThuxROt9rZl/OAA---Oman-Automobile-Association?node-id=232-1183&t=YB1uGcm86pmjbI7T-1&scaling=contain&content-scaling=fixed&page-id=0%3A1';
  urlSafe: SafeResourceUrl | undefined;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
