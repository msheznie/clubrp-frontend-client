import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { CardSectionComponent } from './components/card-section/card-section.component';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { VtpApplyComponent } from './vtp-apply/vtp-apply.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TermsAndConditionsComponent } from './vtp-apply/components/terms-and-conditions/terms-and-conditions.component';
import { BasicInformationComponent } from './vtp-apply/components/basic-information/basic-information.component';
import { ParticularOfVehicleComponent } from './vtp-apply/components/particular-of-vehicle/particular-of-vehicle.component';
import { OwnerAddressSultanateOfOmanComponent } from './vtp-apply/components/owner-address-sultanate-of-oman/owner-address-sultanate-of-oman.component';
import { OwnerAddressHomeCountryComponent } from './vtp-apply/components/owner-address-home-country/owner-address-home-country.component';
import { TermsAndConditionComponent } from './vtp-apply/components/terms-and-condition/terms-and-condition.component';
import { ApprovalsComponent } from './vtp-apply/components/approvals/approvals.component';
import { FeeAndChargersComponent } from './vtp-apply/components/fee-and-chargers/fee-and-chargers.component';
import { ReferenceSultanateOmanComponent } from './vtp-apply/components/reference-sultanate-oman/reference-sultanate-oman.component';
import { ReferencesYourHomeCountryComponent } from './vtp-apply/components/references-your-home-country/references-your-home-country.component';
import { AttachmentsComponent } from './vtp-apply/components/attachments/attachments.component';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatStepperModule,
        NavbarComponent,
        HeroSectionComponent,
        CardSectionComponent,
        HomeComponent,
        VtpApplyComponent,
        TermsAndConditionsComponent,
        BasicInformationComponent,
        ParticularOfVehicleComponent,
        OwnerAddressSultanateOfOmanComponent,
        OwnerAddressHomeCountryComponent,
        TermsAndConditionComponent,
        ApprovalsComponent,
        FeeAndChargersComponent,
        ReferenceSultanateOmanComponent,
        ReferencesYourHomeCountryComponent,
        AttachmentsComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
