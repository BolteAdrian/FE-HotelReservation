import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

/**
 * The AuthService handles all authentication-related operations,
 * including login, registration, token management, and authentication status.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // Base URL for authentication endpoints
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated()); // BehaviorSubject to track authentication status

  constructor(private http: HttpClient) {}

  /**
   * Logs in the user by sending their credentials to the backend.
   * If successful, stores the JWT token and updates the authentication status.
   *
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns An Observable of the server's response, typically containing a JWT token.
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        this.storeTokenAndUserId(response.jwt, response.userId); // Store the JWT token in local storage
        this.authStatus.next(true); // Update authentication status to true
      })
    );
  }

  /**
   * Registers a new user by sending their details to the backend.
   *
   * @param username The username of the new user.
   * @param email The email of the new user.
   * @param password The password of the new user.
   * @returns An Observable of the server's response.
   */
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {
      username,
      email,
      password,
    });
  }

  /**
   * Stores the JWT token in local storage.
   *
   * @param token The JWT token to be stored.
   */
  storeTokenAndUserId(token: string, userId: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
  }

  /**
   * Retrieves the JWT token from local storage.
   *
   * @returns The JWT token if it exists, otherwise null.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /**
   * Logs out the user by removing the JWT token from local storage
   * and updating the authentication status.
   */
  logout(): void {
    localStorage.removeItem('authToken'); // Remove the JWT token
    this.authStatus.next(false); // Update authentication status to false
  }

  /**
   * Removes the JWT token from local storage.
   */
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Checks if the user is authenticated by verifying the existence and validity of the JWT token.
   *
   * @returns A boolean indicating whether the user is authenticated.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (this.isTokenExpired(token)) {
      this.removeToken(); // If the token is expired, remove it
      return false;
    }
    return !!token; // Return true if a valid token exists
  }

  /**
   * Returns an Observable that emits the current authentication status.
   *
   * @returns An Observable of the authentication status.
   */
  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  /**
   * Checks if the JWT token is expired.
   *
   * @param token The JWT token to be checked.
   * @returns A boolean indicating whether the token is expired.
   */
  isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const decoded: any = jwtDecode(token); // Decode the JWT token to extract expiry information
    const expiry = decoded.exp * 1000; // Convert expiry time to milliseconds
    return Date.now() >= expiry; // Check if the current time is past the expiry time
  }
}
