import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar }
  from './shared/navbar/navbar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('darts-scoreboard-client');
  constructor(
    public readonly authService: AuthService
  ) {
  }
}
