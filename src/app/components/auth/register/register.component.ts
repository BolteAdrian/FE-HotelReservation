import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.isLoading = true;
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        (error) => {
          this.isLoading = false;
          this.error = 'Registration failed. Please try again.';
          console.error('Registration failed', error);
        }
      );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
