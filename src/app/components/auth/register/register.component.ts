import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * The `RegisterComponent` manages the user registration process.
 * It handles user input, communicates with the authentication service,
 * and navigates users based on the registration outcome.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  // Properties to store the user's input during registration
  username: string = ''; // Stores the entered username
  email: string = ''; // Stores the entered email address
  password: string = ''; // Stores the entered password
  showPassword: boolean = false; // Toggles the visibility of the password input
  isLoading: boolean = false; // Indicates if a registration request is in progress
  error: string | null = null; // Holds error messages for display if registration fails

  /**
   * Constructor for injecting dependencies.
   *
   * @param authService The service responsible for handling authentication
   * @param router Manages navigation within the application
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Initiates the registration process.
   *
   * This method sends the user's registration data to the authentication service.
   * On success, it navigates to the login page. On failure, it displays an error message.
   */
  register() {
    this.isLoading = true; // Start the loading indicator
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        (response) => {
          // On successful registration, stop loading and navigate to the login page
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        (error) => {
          // On registration failure, stop loading, display an error message, and log the error
          this.isLoading = false;
          this.error = 'Registration failed. Please try again.';
          console.error('Registration failed', error);
        }
      );
  }

  /**
   * Toggles the visibility of the password input field.
   *
   * This method changes the `showPassword` boolean, allowing the password field
   * to switch between visible text and masked text.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
