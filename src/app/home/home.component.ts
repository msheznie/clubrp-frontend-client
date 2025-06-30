import { Component } from '@angular/core';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { HeroSectionComponent } from "../components/hero-section/hero-section.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [NavbarComponent, HeroSectionComponent]
})
export class HomeComponent {

}
