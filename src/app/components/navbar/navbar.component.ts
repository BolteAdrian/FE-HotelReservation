import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the authentication status
    this.authService.getAuthStatus().subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  // Function to handle logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Function to toggle dropdown (dummy implementation for now)
  toggleDropdown(): void {
    // Toggle logic here
  }
}
