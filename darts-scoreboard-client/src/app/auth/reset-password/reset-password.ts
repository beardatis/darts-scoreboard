import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isSubmitting = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.token =
      this.route.snapshot.queryParamMap.get('token') ?? '';

    this.email =
      this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  resetPassword(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.email || !this.token || !this.newPassword || !this.confirmPassword) {
      this.message = 'Minden mező kitöltése kötelező.';
      this.changeDetectorRef.detectChanges();
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'A két jelszó nem egyezik.';
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.authService
      .resetPassword(this.email, this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.message =
            'A jelszó sikeresen módosítva. Átirányítunk a bejelentkezéshez...';

          this.changeDetectorRef.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 4000);
        },
        error: () => {
          this.isSubmitting = false;
          this.message = 'Nem sikerült módosítani a jelszót.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
