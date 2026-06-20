import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    LanguageSwitcher
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  isLoggingIn = false;

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

        this.router.navigate(['/games/create']);
      },
      error: error => {
        this.isLoggingIn = false;
        this.changeDetectorRef.detectChanges();

        console.error(error);

        alert(
          this.translateService.instant('AUTH.ERROR_INVALID_LOGIN')
        );
      }
    });
  }
}
