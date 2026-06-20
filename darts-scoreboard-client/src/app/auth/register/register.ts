import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';


@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    LanguageSwitcher
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {

  username = '';
  email = '';
  password = '';
  isRegistering = false;

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
    private readonly authService: AuthService,
    private readonly router: Router,
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

  register(): void {
    if (this.isRegistering) {
      return;
    }

    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password.trim()
    ) {
      alert(
        this.translateService.instant('AUTH.ERROR_REQUIRED_FIELDS')
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email.trim())) {
      alert(
        this.translateService.instant('AUTH.ERROR_INVALID_EMAIL')
      );
      return;
    }

    if (this.password.length < 6) {
      alert(
        this.translateService.instant('AUTH.ERROR_PASSWORD_TOO_SHORT')
      );
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
          this.isRegistering = false;
          this.changeDetectorRef.detectChanges();

          alert(
            this.translateService.instant('AUTH.SUCCESS_REGISTER')
          );

          this.router.navigate(['/']);
        },
        error: error => {
          console.error(error);

          this.isRegistering = false;
          this.changeDetectorRef.detectChanges();

          if (error.error) {
            alert(error.error);
          } else {
            alert(
              this.translateService.instant('AUTH.ERROR_REGISTER_FAILED')
            );
          }
        }
      });
  }
}
