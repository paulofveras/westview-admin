import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Interceptors agora são funções simples
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injetando serviços com a função inject()
  const token = authService.getToken();

  // 1. ADICIONA O TOKEN DE AUTORIZAÇÃO (SE EXISTIR)
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. PASSA A REQUISIÇÃO ADIANTE E CENTRALIZA O TRATAMENTO DE ERRO 401
  return next(req).pipe(
    catchError((error: any) => {
      // Se o erro for de autenticação (401 - Unauthorized)
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.error('Erro 401: Não autorizado. Redirecionando para login.');
        // Executa o logout, que remove o token inválido e redireciona
        authService.logout();
      }
      // Propaga o erro para que outros `catchError` na aplicação possam tratá-lo se necessário
      return throwError(() => error);
    })
  );
};
