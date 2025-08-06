import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.scss'
})
export class PaymentGatewayComponent {

}
