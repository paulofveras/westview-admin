import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtém as roles esperadas para a rota, se houver alguma definida
  const requiredRoles = route.data['roles'] as string[];

  // Se a rota exige roles e o usuário não tem nenhuma delas, nega o acesso
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.some(role => authService.hasRole(role))) {
      // Opcional: redirecionar para uma página de "acesso negado" ou de volta para a home
      router.navigate(['/']); // ou para uma página de acesso negado
      return false;
    }
  }

  // Se passou por todas as verificações, permite o acesso
  return true;
};