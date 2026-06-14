import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  username = '';
  email = '';
  password = '';
  isRegistering = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  register(): void {
    if (this.isRegistering) {
      return;
    }

    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password.trim()
    ) {
      alert('Minden mező kitöltése kötelező.');
      return;
    }
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email.trim())) {
      alert('Érvénytelen email cím.');
      return;
    }
    if (this.password.length < 6) {
      alert('A jelszó legalább 6 karakter legyen.');
      return;
    }
    this.isRegistering = true;
    this.changeDetectorRef.detectChanges();

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    })
      .subscribe({
        next: () => {
          alert('Sikeres regisztráció.');
          this.router.navigate(['/']);
        },
        error: error => {
          console.error(error);
          this.isRegistering = false;
          this.changeDetectorRef.detectChanges();

          if (error.error) {
            alert(error.error);
          } else {
            alert('Nem sikerült regisztrálni.');
          }
        }
      });
  }
}
