import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importe 'withInterceptorsFromDi'
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Importe 'HTTP_INTERCEPTORS'
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Importe seu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Configuração do Interceptor
    provideHttpClient(withInterceptorsFromDi()), // Habilita interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]
};