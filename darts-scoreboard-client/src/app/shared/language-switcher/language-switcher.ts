import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss'
})
export class LanguageSwitcher implements OnInit {

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
}
