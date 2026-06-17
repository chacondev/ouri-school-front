import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { from, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse, UserRole } from '../models/auth.model';
import { CryptoService } from './crypto.service';
import { AlertService } from '../../shared/alert-dialog/alert.service';


const CLIENT_HEADER = 'Basic ' + btoa('ouri-school-app:HashAqui!10');

import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private crypto = inject(CryptoService);
  private api = inject(API_URL);
  private alert = inject(AlertService);

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, senha: string) {
    return from(this.crypto.criptografar(senha)).pipe(
      switchMap((senhaCriptografada) => {
        const headers = new HttpHeaders({ Authorization: CLIENT_HEADER });
        return this.http
          .post<LoginResponse>(`${this.api}/auth/login`, { email, senha: senhaCriptografada }, { headers })
          .pipe(
            tap((res) => {
              if (this.isBrowser) {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('role', this.extrairRole(res.accessToken));
                localStorage.setItem('nome', res.nome);
              }
            })
          );
      })
    );
  }

  private extrairRole(token: string): UserRole {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload.roles ?? [];
      if (roles.includes('ROLE_DONO')) return 'DONO';
      if (roles.includes('ROLE_PROFESSOR')) return 'PROFESSOR';
      return 'ALUNO';
    } catch {
      return 'ALUNO';
    }
  }

  logout() {
    if (this.isBrowser) localStorage.clear();
    this.router.navigate(['/login']);
  }

  confirmarLogout() {
    this.alert.confirmar('Deseja realmente sair da sua conta?', 'Sair').subscribe(confirmado => {
      if (confirmado) this.logout();
    });
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
}
