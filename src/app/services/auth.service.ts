import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UsuarioResponse } from '../models/pessoa.model';

export interface LoginPayload {
  username: string;
  senha?: string;
  perfil: number; 
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
  private readonly userKey = 'usuario-logado'; // Chave para salvar o usuário

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/auth`, payload).pipe(
      tap(res => {
        // Salva o token
        localStorage.setItem(this.tokenKey, res.token);
        
        // Salva o objeto usuário inteiro (com ID, nome, etc.)
        // Isso é crucial para o Perfil e para o Carrinho funcionarem
        if (res.usuario) {
          localStorage.setItem(this.userKey, JSON.stringify(res.usuario));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey); // Limpa os dados do usuário ao sair
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // --- O MÉTODO QUE FALTAVA ---
  getUsuarioLogado(): UsuarioResponse | null {
    const userJson = localStorage.getItem(this.userKey);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Erro ao ler usuário do storage', e);
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  getUser(): { sub: string; groups: string[] } | null {
    const token = this.getToken();
    try {
      return token ? jwtDecode(token) : null;
    } catch (error) {
      return null;
    }
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return !!user && user.groups && user.groups.includes(role);
  }

  isFuncionario(): boolean {
    return this.hasRole('Funcionario');
  }

  isAdministrador(): boolean {
    return this.hasRole('Administrador');
  }
}