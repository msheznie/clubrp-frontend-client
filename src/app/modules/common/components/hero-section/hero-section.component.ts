import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SignInComponent } from 'src/app/modules/auth/sign-in/sign-in.component';

@Component({
    selector: 'app-hero-section',
    templateUrl: './hero-section.component.html',
    styleUrls: ['./hero-section.component.scss'],
    standalone: true,
    imports: [RouterModule, RouterLink, MatDialogModule]
})
export class HeroSectionComponent {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  onTrackClick(applicationTypeParam?: string): void {
    if (this.authService.isAuthenticated()) {
      const queryParams = applicationTypeParam ? { application_type: applicationTypeParam } : {};
      this.router.navigate(['/track'], { queryParams });
      return;
    }

    this.dialog.open(SignInComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
      data: { type: 'public' }
    });
  }
}
