import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../shared/models/login-request';
import { LoginResponse } from '../../shared/models/login-response';
import { RegisterRequest } from '../../shared/models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'darts_scoreboard_token';

  constructor(private readonly httpClient: HttpClient) {
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${environment.apiUrl}/api/auth/login`,
      request
    );

  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  register(request: RegisterRequest) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/auth/register`,
      request
    );
  }
  forgotPassword(email: string) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/auth/forgot-password`,
      {
        email
      }
    );
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/auth/reset-password`,
      {
        email,
        token,
        newPassword
      }
    );
  }
}
