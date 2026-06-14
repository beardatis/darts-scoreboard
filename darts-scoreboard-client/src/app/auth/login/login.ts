import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email = '';
  password = '';
  isLoggingIn = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  login(): void {
    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;
    this.changeDetectorRef.detectChanges();

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: response => {
        this.authService.saveToken(response.token);

        localStorage.setItem(
          'username',
          response.username
        );

        console.log('Sikeres login');

        this.router.navigate(['/games/create']);
      },
      error: error => {
        this.isLoggingIn = false;
        this.changeDetectorRef.detectChanges();

        console.error(error);
        alert('Hibás email vagy jelszó.');
      }
    });
  }
}
