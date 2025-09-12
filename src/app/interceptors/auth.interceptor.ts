import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  console.log('Interceptor - Token encontrado:', token); // Debug

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor - Header Authorization adicionado'); // Debug
  }

  return next(authReq).pipe(
    catchError((error) => {
      console.log('Interceptor - Erro:', error.status); // Debug
      if (error.status === 401) {
        console.log('Erro 401: Não autorizado. Redirecionando para login.');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
