import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  usuario: any;
}

export interface AuthRequest {
  username: string;
  senha: string;
  perfil: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'auth_token';
  private usuarioKey = 'usuario';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string, perfil: number): Observable<AuthResponse> {
    const authRequest: AuthRequest = {
      username,
      senha: password,
      perfil
    };

    return this.http.post<AuthResponse>(this.apiUrl, authRequest).pipe(
      tap(response => {
        console.log('Resposta completa do login:', response); // Debug
        if (response && response.token) {
          this.setToken(response.token);
          this.setUsuario(response.usuario || { username: username });
          this.isAuthenticatedSubject.next(true);
          console.log('Login bem-sucedido - Token salvo'); // Debug
        } else {
          console.error('Token não encontrado na resposta'); // Debug
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.isAuthenticatedSubject.next(false);
    console.log('Logout realizado'); // Debug
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Token recuperado do localStorage:', token); // Debug
    return token;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token salvo no localStorage:', token); // Debug
  }

  setUsuario(usuario: any): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
    console.log('Usuário salvo:', usuario); // Debug
  }

  getUsuario(): any {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  hasToken(): boolean {
    const token = this.getToken();
    const hasToken = !!token;
    console.log('Tem token?', hasToken); // Debug
    return hasToken;
  }

  // Método para debug
  debugAuth(): void {
    console.log('=== DEBUG AUTH ===');
    console.log('Token:', this.getToken());
    console.log('Usuário:', this.getUsuario());
    console.log('Tem token?', this.hasToken());
    console.log('LocalStorage completo:', localStorage);
    console.log('==================');
  }
}