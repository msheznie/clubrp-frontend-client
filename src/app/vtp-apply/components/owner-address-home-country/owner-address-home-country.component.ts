import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-owner-address-home-country',
  templateUrl: './owner-address-home-country.component.html',
  styleUrls: ['./owner-address-home-country.component.scss'],
  standalone: true,
    imports: [
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
})
export class OwnerAddressHomeCountryComponent {

}
