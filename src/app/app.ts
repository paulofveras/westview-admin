import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'westview-admin';

  currentUrl = '';
  cartCount = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.cartService.items$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  logout() {
    this.authService.logout();
  }

  goToAdmin(): void {
    this.router.navigate(['/dashboard']);
  }

  goToStore(): void {
    this.router.navigate(['/loja']);
  }

  isStoreView(): boolean {
    return this.currentUrl.startsWith('/loja') || this.currentUrl.startsWith('/carrinho');
  }

  isAdminView(): boolean {
    return !this.isStoreView();
  }
}
