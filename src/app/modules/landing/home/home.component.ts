import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../client/navbar/navbar.component";
import { HeroSectionComponent } from "../../client/hero-section/hero-section.component";
import { ApiService } from '../../../shared/services/api.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [NavbarComponent, HeroSectionComponent]
})
export class HomeComponent {
    private api = inject(ApiService);
    // users: any[] = [];

    ngOnInit() {
        // this.api.get<any[]>('/users').subscribe(data => this.users = data);
    }
}
