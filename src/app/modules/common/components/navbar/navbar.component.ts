import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignInComponent } from 'src/app/modules/auth/sign-in/sign-in.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
imports: [CommonModule, MatMenuModule, MatDialogModule, RouterLink],
  standalone: true,
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  constructor(private dialog: MatDialog) {}

  openSignin() {
    const dialogRef = this.dialog.open(SignInComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
    });
  }

toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
  console.log('Toggle clicked. Now open:', this.isMobileMenuOpen);
}
}
