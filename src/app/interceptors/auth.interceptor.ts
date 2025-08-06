import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthUtils } from '../shared/utils/auth.utils';
import { AuthService } from 'src/app/shared/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('auth_token');
  if (token && !AuthUtils.isTokenExpired(token)) {
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
            AuthUtils.logout();

            // Reload the app
            location.reload();
        }

        return throwError(() => error);
    })
  );
};