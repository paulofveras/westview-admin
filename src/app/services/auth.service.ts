import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
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

  login(username: string, password: string, perfil: number): Observable<HttpResponse<AuthResponse>> {
    const authRequest: AuthRequest = {
      username,
      senha: password,
      perfil
    };

    return this.http.post<AuthResponse>(this.apiUrl, authRequest, {
      observe: 'response' // Isso nos permite acessar os headers
    }).pipe(
      tap(response => {
        if (response && response.headers) {
          const authHeader = response.headers.get('Authorization');
          if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7); // Remove 'Bearer ' do início
            this.setToken(token);
            
            // Se o backend também retornar dados do usuário no body
            if (response.body) {
              this.setUsuario(response.body.usuario);
            } else {
              // Se não, criamos um objeto básico com o username
              this.setUsuario({ username: username });
            }
            
            this.isAuthenticatedSubject.next(true);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token salvo:', token); // Para debug
  }

  setUsuario(usuario: any): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
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
    return !!token;
  }

  // Método para debug
  debugAuth(): void {
    console.log('Token:', this.getToken());
    console.log('Usuário:', this.getUsuario());
    console.log('Tem token?', this.hasToken());
  }
}