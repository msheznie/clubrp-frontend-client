import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-fee-and-chargers',
  templateUrl: './fee-and-chargers.component.html',
  styleUrls: ['./fee-and-chargers.component.scss'],
  standalone: true,
      imports: [
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule
      ],
})
export class FeeAndChargersComponent {

}
