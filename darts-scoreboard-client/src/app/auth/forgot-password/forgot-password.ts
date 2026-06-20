import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';


@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    LanguageSwitcher
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword implements OnInit {

  email = '';
  message = '';
  isSubmitting = false;

  currentLanguage = 'hu';

  readonly languages = [
    { code: 'hu', label: 'HU' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.currentLanguage =
      localStorage.getItem('language') ?? 'hu';
  }

  changeLanguage(language: string): void {
    this.currentLanguage = language;

    localStorage.setItem(
      'language',
      language
    );

    this.translateService.use(language);
  }

  forgotPassword(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.email.trim()) {
      this.message =
        this.translateService.instant('AUTH.ERROR_REQUIRED_FIELDS');

      this.changeDetectorRef.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.authService
      .forgotPassword(this.email)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          this.message =
            this.translateService.instant('AUTH.FORGOT_PASSWORD_SUCCESS');

          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.isSubmitting = false;

          this.message =
            this.translateService.instant('AUTH.FORGOT_PASSWORD_ERROR');

          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
