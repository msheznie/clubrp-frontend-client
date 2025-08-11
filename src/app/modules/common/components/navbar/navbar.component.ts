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
  userName = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userName = this.authService.getUserName();
    const authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuth) => {
        this.isAuthenticated = isAuth;
      }
    );
    const userNameSubscription = this.authService.userName$.subscribe(
      (userName) => {
        this.userName = userName;
      }
    );
    this.subscriptions.push(authSubscription, userNameSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  openSignin() {
    const dialogRef = this.dialog.open(SignInComponent, {
      height: 'auto',
      width: '40em',
      panelClass: 'default-preview-dialog',
      data: {
        type: 'public'
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
