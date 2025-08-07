import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignInComponent } from 'src/app/modules/auth/sign-in/sign-in.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
imports: [CommonModule, MatMenuModule, MatDialogModule, RouterLink],
  standalone: true,
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isAuthenticated = false;
  isUserMenuOpen = false;
  private authSubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuth) => {
        this.isAuthenticated = isAuth;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

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

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    console.log('User menu toggled. Now open:', this.isUserMenuOpen);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
