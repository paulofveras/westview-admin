import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Importe a biblioteca
import { Observable, tap } from 'rxjs';
import { UsuarioResponse } from '../models/pessoa.model';

// Modelo para os dados do login
export interface Login {
  username: string;
  senha?: string;
  perfil: number; // 1 para Funcionario, 2 para Cliente
}

// Modelo para a resposta completa do login do backend
export interface AuthResponse {
  token: string;
  usuario: UsuarioResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL: string = 'http://localhost:8080';
  private tokenKey: string = 'jwt-token';

  constructor(private http: HttpClient, private router: Router) { }

  login(data: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/auth`, data).pipe(
      tap((res) => {
        // Armazena o token no localStorage após o login
        localStorage.setItem(this.tokenKey, res.token);
      })
    );
  }

  logout() {
    // Remove o token e redireciona para a página de login
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Decodifica o token para obter as informações do usuário, incluindo as roles
  getUser(): { sub: string, groups: string[] } | null {
    const token = this.getToken();
    if (token) {
      // A biblioteca jwt-decode faz o trabalho pesado de decodificar o token
      return jwtDecode(token);
    }
    return null;
  }

  // Verifica se o usuário logado possui uma role específica
  hasRole(role: string): boolean {
    const user = this.getUser();
    if (user) {
      // O backend Quarkus coloca as roles no campo 'groups' do JWT
      return user.groups.includes(role);
    }
    return false;
  }

  // Atalho para verificar se é um administrador/funcionário
  isFuncionario(): boolean {
    return this.hasRole('Funcionario');
  }
}