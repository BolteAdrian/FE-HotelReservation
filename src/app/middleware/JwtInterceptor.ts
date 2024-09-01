import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { catchError } from 'rxjs/operators';

/**
 * The `JwtInterceptor` class implements the `HttpInterceptor` interface.
 * It intercepts HTTP requests and adds the JWT token to the request headers if available and valid.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * Constructor for injecting dependencies.
   *
   * @param authService Provides methods to access authentication details and manage tokens.
   */
  constructor(private authService: AuthService) {}

  /**
   * Intercepts HTTP requests and adds the JWT token to the headers if available and valid.
   *
   * @param request The outgoing HTTP request that needs to be intercepted.
   * @param next The `HttpHandler` used to handle the request.
   * @returns An observable of the HTTP event.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve the token from the AuthService
    const token = this.authService.getToken();

    // Check if the token is available and not expired
    if (token && !this.authService.isTokenExpired(token)) {
      // Clone the request and set the Authorization header with the JWT token
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // If the token is expired or not available, log the user out
      this.authService.logout();
    }

    // Pass the request to the next handler and handle errors if any
    return next.handle(request).pipe(
      catchError((error) => {
        // Optionally handle errors (e.g., log them or show a notification)
        throw error; // Rethrow the error to propagate it
      })
    );
  }
}
