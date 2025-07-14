import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './modules/landing/home/home.component'
// import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HomeComponent,
        BrowserAnimationsModule,
        // MatIconModule,
        // MatStepperModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
