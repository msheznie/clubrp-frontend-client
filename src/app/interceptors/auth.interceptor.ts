import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  const token = localStorage.getItem('auth_token');
  if (token && !authService.isTokenExpired()) {
    let currentLanguage = localStorage.getItem('lang') ?? 'en';
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}`, 'Accept-Language': currentLanguage }
    });
  }

  return next(req).pipe(
    catchError((error) => {
        // Catch "401 Unauthorized" responses
        if ( error instanceof HttpErrorResponse && error.status === 401 )
        {
            // Sign out
            authService.logout();

            // Reload the app
            location.reload();
        }

        return throwError(() => error);
    })
  );
};