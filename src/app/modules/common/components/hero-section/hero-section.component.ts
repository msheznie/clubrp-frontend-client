import { Component } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';

@Component({
    selector: 'app-hero-section',
    templateUrl: './hero-section.component.html',
    styleUrls: ['./hero-section.component.scss'],
    standalone: true,
    imports: [RouterModule, RouterLink]
})
export class HeroSectionComponent {
  
}
