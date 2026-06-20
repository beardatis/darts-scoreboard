import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';


@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    LanguageSwitcher
  ],
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

  currentLanguage = 'hu';

  readonly languages = [
    {
      code: 'hu',
      label: 'HU'
    },
    {
      code: 'en',
      label: 'EN'
    },
    {
      code: 'de',
      label: 'DE'
    }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.currentLanguage =
      localStorage.getItem('language') ?? 'hu';

    this.token =
      this.route.snapshot.queryParamMap.get('token') ?? '';

    this.email =
      this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  changeLanguage(language: string): void {
    this.currentLanguage = language;

    localStorage.setItem(
      'language',
      language
    );

    this.translateService.use(language);
  }

  resetPassword(): void {
    if (this.isSubmitting) {
      return;
    }

    if (
      !this.email ||
      !this.token ||
      !this.newPassword ||
      !this.confirmPassword
    ) {
      this.message =
        this.translateService.instant('AUTH.ERROR_REQUIRED_FIELDS');

      this.changeDetectorRef.detectChanges();
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message =
        this.translateService.instant('AUTH.ERROR_PASSWORDS_DO_NOT_MATCH');

      this.changeDetectorRef.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.authService
      .resetPassword(
        this.email,
        this.token,
        this.newPassword
      )
      .subscribe({
        next: () => {
          this.message =
            this.translateService.instant('AUTH.SUCCESS_RESET_PASSWORD');

          this.changeDetectorRef.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 4000);
        },
        error: () => {
          this.isSubmitting = false;

          this.message =
            this.translateService.instant('AUTH.ERROR_RESET_PASSWORD_FAILED');

          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
