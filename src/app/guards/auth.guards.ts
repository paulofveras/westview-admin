import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.hasToken()) {
      return true;
    } else {
      // Redirecionar para login com a URL de retorno
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: route.url.join('/') } 
      });
      return false;
    }
  }
}