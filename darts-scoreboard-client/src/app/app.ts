import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Navbar } from './shared/navbar/navbar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title =
    signal('darts-scoreboard-client');

  constructor(
    public readonly authService: AuthService,
    private readonly translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    const savedLanguage =
      localStorage.getItem('language') ?? 'hu';

    this.translateService.use(savedLanguage);
  }
}
