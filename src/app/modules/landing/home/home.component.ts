import { Component } from '@angular/core';
import { NavbarComponent } from "../../client/navbar/navbar.component";
import { HeroSectionComponent } from "../../client/hero-section/hero-section.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [NavbarComponent, HeroSectionComponent]
})
export class HomeComponent {

}
