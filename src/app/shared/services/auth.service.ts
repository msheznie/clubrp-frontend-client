import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, retry, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { HelperService } from './helper.service';

export interface LoginRequest {
  email: string;
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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private config = inject(AppConfigService);
  private baseUrl = this.config.baseUrl;
  private apiversion = '/api/v1';
  private subdomain = inject(HelperService).getSubDomain();

  private readonly API_BASE_URL = `${this.baseUrl}/${this.subdomain}${this.apiversion}`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

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

    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * User signup
   */
  signup(signupData: SignupRequest): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/idl/sign-up`, signupData)
  }

  /**
   * User login
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    const params: any = {
      'grant_type': 'password',
      'client_id': this.config.getConfig().client_id,
      'client_secret': this.config.getConfig().client_secret,
      'username': loginData.email,
      'password': loginData.password,
      'scope': '',
      'is_idl': true
  };

    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/oauth/token`, params)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.handleError(error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isAuthenticatedSubject.next(false);
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
    localStorage.removeItem(this.USER_KEY);

    this.isAuthenticatedSubject.next(false);
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

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  resendOtp(resendData: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/idl/resend-otp`, resendData)
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

    this.isAuthenticatedSubject.next(true);
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
    this.isAuthenticatedSubject.next(false);
  }
}
