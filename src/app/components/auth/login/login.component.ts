import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * The `LoginComponent` handles the login process for users.
 * It provides methods for user authentication and controls the login UI state.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // Properties to store the user's input
  username: string = ''; // Stores the entered username
  password: string = ''; // Stores the entered password
  showPassword: boolean = false; // Toggles the visibility of the password input
  isLoading: boolean = false; // Indicates if a login request is in progress
  error: string | null = null; // Holds error messages for display

  /**
   * The constructor injects `AuthService` for authentication and `Router` for navigation.
   * 
   * @param authService Handles the authentication logic
   * @param router Manages navigation within the app
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Handles the login process.
   * 
   * This method is triggered when the user attempts to log in. It sets the loading state, 
   * calls the authentication service, and handles the success or error response.
   */
  login() {
    this.isLoading = true; // Start loading indicator
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // On successful login, stop loading and navigate to the home page
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      (error) => {
        // On login failure, stop loading, display an error message, and log the error
        this.isLoading = false;
        this.error = 'Login failed. Please try again.';
        console.error('Login failed', error);
      }
    );
  }

  /**
   * Toggles the visibility of the password input field.
   * 
   * This method switches the `showPassword` boolean, which in turn changes 
   * whether the password is displayed as plain text or hidden.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
