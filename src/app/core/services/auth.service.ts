import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, UserRole } from '../models/auth.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, senha: string) {
    const body: LoginRequest = { email, senha };
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(`${email}:${senha}`) });
    return this.http.post<LoginResponse>(`${API}/auth/login`, body, { headers }).pipe(
      tap((res) => {
        if (this.isBrowser) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('nome', res.nome);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  getRole(): UserRole | null {
    return this.isBrowser ? (localStorage.getItem('role') as UserRole) : null;
  }

  getNome(): string {
    return this.isBrowser ? (localStorage.getItem('nome') ?? '') : '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthHeader(): string {
    return `Bearer ${this.getToken()}`;
  }
}
