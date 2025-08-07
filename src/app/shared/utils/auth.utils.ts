import { inject } from "@angular/core";

export class AuthUtils {
    static isTokenExpired(token: string): boolean {
        if (!token) return true;

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiry = payload.exp * 1000; // Convert to milliseconds
          return Date.now() >= expiry;
        } catch (error) {
          return true;
        }
    }

    static logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    }
}