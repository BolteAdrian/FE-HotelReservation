import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Login failed. Please try again.';
        console.error('Login failed', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
