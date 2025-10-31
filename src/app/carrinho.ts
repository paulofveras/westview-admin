import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from './services/cart.service';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page">
      <h2>Meu carrinho</h2>

      <ng-container *ngIf="items.length; else emptyCart">
        <div class="cart-list">
          <div class="cart-item" *ngFor="let item of items">
            <img [src]="placeholderImage" alt="{{ item.quadrinho.nome }}" />
            <div class="cart-item-info">
              <h3>{{ item.quadrinho.nome }}</h3>
              <p>{{ item.quadrinho.descricao }}</p>
              <div class="cart-item-actions">
                <span class="price">{{ item.quadrinho.preco | currency:'BRL':'symbol-narrow' }}</span>
                <span class="quantity">Qtd: {{ item.quantity }}</span>
                <button class="link" (click)="remover(item.quadrinho.id)">Remover 1</button>
                <button class="link" (click)="removerTudo(item.quadrinho.id)">Remover todos</button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div>
            <span>Total de itens:</span>
            <strong>{{ totalItens }}</strong>
          </div>
          <div>
            <span>Total:</span>
            <strong>{{ total | currency:'BRL':'symbol-narrow' }}</strong>
          </div>
          <button class="btn-primary" (click)="finalizarCompra()">Finalizar Compra</button>
          <button class="btn-link" (click)="limpar()">Esvaziar carrinho</button>
        </div>
      </ng-container>

      <ng-template #emptyCart>
        <div class="cart-empty">
          <h3>Seu carrinho está vazio</h3>
          <p>Volte para a <a routerLink="/loja">loja</a> e adicione alguns quadrinhos.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: `
    .cart-page { max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
    .cart-list { display: flex; flex-direction: column; gap: 16px; }
    .cart-item { display: flex; gap: 16px; padding: 16px; border-radius: 8px; background: var(--surface-color, #1f1f1f12); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .cart-item img { width: 96px; height: 128px; object-fit: cover; border-radius: 6px; }
    .cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .cart-item-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .price { font-weight: 600; }
    .quantity { font-size: 0.875rem; color: var(--text-muted-color, #666); }
    .link { background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 0; }
    .cart-summary { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 8px; background: var(--surface-color, #1f1f1f12); }
    .cart-summary > div { display: flex; justify-content: space-between; }
    .btn-primary { background-color: var(--primary-color); color: var(--text-light-color); border: none; border-radius: 6px; padding: 10px 18px; cursor: pointer; font-weight: 600; }
    .btn-link { align-self: flex-start; background: none; border: none; color: var(--primary-color); cursor: pointer; }
    .cart-empty { text-align: center; padding: 48px; background: var(--surface-color, #1f1f1f12); border-radius: 8px; }
    .cart-empty a { color: var(--primary-color); font-weight: 600; }
  `
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total = 0;
  totalItens = 0;
  readonly placeholderImage = 'assets/images/placeholder-comic.svg';
  private subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.items$.subscribe(items => {
        this.items = items;
        this.atualizarTotais();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  remover(idQuadrinho: number): void {
    this.cartService.removeItem(idQuadrinho);
  }

  removerTudo(idQuadrinho: number): void {
    this.cartService.deleteItem(idQuadrinho);
  }

  limpar(): void {
    this.cartService.clear();
  }

  finalizarCompra(): void {
    alert('Funcionalidade de checkout em desenvolvimento. :)');
  }

  private atualizarTotais(): void {
    this.totalItens = this.items.reduce((total, item) => total + item.quantity, 0);
    this.total = this.items.reduce((total, item) => total + item.quadrinho.preco * item.quantity, 0);
  }
}
