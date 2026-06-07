import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {

  email = '';
  message = '';
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  send(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.email.trim()) {
      this.message = 'Add meg az email címed.';
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.authService
      .forgotPassword(this.email.trim())
      .subscribe({
        next: () => {
          // this.isSubmitting = false;

          this.message =
            'E-mail elküldve. Átirányítunk a bejelentkezéshez...';

          this.changeDetectorRef.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 4000);
        },
        error: () => {
          this.isSubmitting = false;
          this.message = 'Nem sikerült elküldeni az e-mailt.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
