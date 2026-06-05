import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  username = '';

  isUserMenuOpen = false;
  menuOpen = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.username =
      localStorage.getItem('username') ?? '';
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen =
      !this.isUserMenuOpen;
  }

  toggleMenu(): void {
    this.menuOpen =
      !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();

    localStorage.removeItem('username');

    this.router.navigate(['/']);
  }
}
