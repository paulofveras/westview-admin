import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UsuarioResponse } from '../models/pessoa.model';

export interface LoginPayload {
  username: string;
  senha?: string;
  perfil: number; // 1 = Funcionario, 2 = Cliente, 3 = Administrador
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseURL = 'http://localhost:8080';
  private readonly tokenKey = 'jwt-token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/auth`, payload).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUser(): { sub: string; groups: string[] } | null {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return !!user && user.groups.includes(role);
  }

  isFuncionario(): boolean {
    return this.hasRole('Funcionario');
  }

  isAdministrador(): boolean {
    return this.hasRole('Administrador');
  }
}
