import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * The `NavbarComponent` is responsible for rendering the navigation bar of the application.
 * It handles user login status, logout functionality, and dropdown interactions.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false; // Tracks whether the user is logged in or not

  /**
   * Constructor for injecting dependencies.
   *
   * @param authService Manages authentication-related operations.
   * @param router Handles navigation between different routes.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   *
   * This method subscribes to the authentication status observable
   * to update the `isLoggedIn` property whenever the user's authentication status changes.
   */
  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status: boolean) => {
      this.isLoggedIn = status; // Update login status based on the emitted value
    });
  }

  /**
   * Logs the user out of the application by calling the `logout` method from `AuthService`
   * and then navigates the user back to the home page.
   */
  logout(): void {
    this.authService.logout(); // Call the logout method in AuthService to clear user session
    this.router.navigate(['/']); // Redirect the user to the home page after logging out
  }
}
