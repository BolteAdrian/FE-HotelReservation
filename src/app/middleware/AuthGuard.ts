import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * The `AuthGuard` service implements the `CanActivate` interface to guard routes.
 * It checks whether the user is authenticated before allowing access to certain routes.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Constructor for injecting dependencies.
   *
   * @param authService Provides methods to check the user's authentication status.
   * @param router Handles navigation to different routes.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether the route can be activated based on the user's authentication status.
   *
   * @returns {boolean} Returns `true` if the user is authenticated, otherwise `false`.
   *                    If the user is not authenticated, they are redirected to the login page.
   */
  canActivate(): boolean {
    // Check if the user is authenticated using the AuthService
    if (!this.authService.isAuthenticated()) {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['/login']);
      return false; // Prevent route activation
    }
    // Allow route activation if the user is authenticated
    return true;
  }
}
