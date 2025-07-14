import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-references-your-home-country',
  templateUrl: './references-your-home-country.component.html',
  styleUrls: ['./references-your-home-country.component.scss'],
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
export class ReferencesYourHomeCountryComponent {

}
