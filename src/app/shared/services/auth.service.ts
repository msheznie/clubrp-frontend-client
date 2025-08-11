import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { HelperService } from './helper.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private config = inject(AppConfigService);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  public userName$ = this.userNameSubject.asObservable();

  private apiversion = '/api/v1';
  private subdomain = inject(HelperService).getSubDomain();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'

  constructor(
    private http: HttpClient,
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuth(): void {
    const token = this.getToken();
    const username = localStorage.getItem('username'); 

    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.userNameSubject.next(username || '');
    }
  }

  /**
   * User signup
   */
  signup(signupData: SignupRequest): Observable<any> {
    return this.http.post<any>(`${this.config.baseUrl}/${this.subdomain}${this.apiversion}/idl/sign-up`, signupData)
  }

  /**
   * User login
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    const params: any = {
      'grant_type': 'password',
      'client_id': this.config.getConfig().client_id,
      'client_secret': this.config.getConfig().client_secret,
      'username': loginData.username,
      'password': loginData.password,
      'scope': '',
      'is_idl': true
  };

    return this.http.post<AuthResponse>(`${this.config.baseUrl}/${this.subdomain}${this.apiversion}/oauth/token`, params)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * User logout
   */
  logout(): void {
    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('username');

    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next('');
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>('api/auth/refresh-access-token', {
      refreshToken: refreshToken
    }).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        // If refresh fails, logout user
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserName(): string {
    return localStorage.getItem('username') || '';
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  resendOtp(resendData: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.config.baseUrl}/${this.subdomain}${this.apiversion}/idl/resend-otp`, resendData)
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true;
    }
  }


  /**
   * Handle successful authentication
   */
  public handleAuthSuccess(response: AuthResponse): void {
    this.setToken(response.access_token);
    if (response.refresh_token) {
      this.setRefreshToken(response.refresh_token);
    }

    if (response.username) {
      localStorage.setItem('username', response.username);
    }

    this.isAuthenticatedSubject.next(true);
    this.userNameSubject.next(response.username || '');
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next('');
  }
}
