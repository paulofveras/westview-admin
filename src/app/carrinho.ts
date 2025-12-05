import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CartItem, CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { PedidoService, PedidoDTO } from './services/pedido.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cart-page">
      <h2>Meu carrinho</h2>

      <ng-container *ngIf="items.length; else emptyCart">
        <div class="cart-list">
          <div class="cart-item" *ngFor="let item of items">
            <img [src]="getUrlImagem(item.quadrinho.nomeImagem)" 
                 alt="{{ item.quadrinho.nome }}" 
                 (error)="handleImageError($event)"/>
            
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

          <div class="payment-group">
            <label>Forma de Pagamento:</label>
            <select [(ngModel)]="idPagamentoSelecionado" class="payment-select">
              <option [ngValue]="1">PIX</option>
              <option [ngValue]="2">Boleto</option>
            </select>
          </div>

          <button class="btn-primary" 
                  (click)="finalizarCompra()" 
                  [disabled]="isProcessing">
            {{ isProcessing ? 'Processando...' : 'Finalizar Compra' }}
          </button>
          
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
    .cart-page { max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; padding: 20px; }
    .cart-list { display: flex; flex-direction: column; gap: 16px; }
    .cart-item { display: flex; gap: 16px; padding: 16px; border-radius: 8px; background: var(--surface-color, #fff); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .cart-item img { width: 96px; height: 128px; object-fit: cover; border-radius: 6px; background-color: #eee; }
    .cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .cart-item-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .price { font-weight: 600; }
    .quantity { font-size: 0.875rem; color: #666; }
    .link { background: none; border: none; color: var(--primary-color, #c62828); cursor: pointer; padding: 0; text-decoration: underline; }
    
    .cart-summary { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 8px; background: var(--surface-color, #fff); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .cart-summary > div { display: flex; justify-content: space-between; align-items: center; }
    
    .payment-group { align-items: flex-start !important; flex-direction: column; gap: 5px; }
    .payment-select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }

    .btn-primary { background-color: var(--primary-color, #c62828); color: #fff; border: none; border-radius: 6px; padding: 12px 18px; cursor: pointer; font-weight: 600; transition: opacity 0.2s; }
    .btn-primary:disabled { background-color: #ccc; cursor: not-allowed; }
    .btn-link { align-self: flex-start; background: none; border: none; color: var(--primary-color, #c62828); cursor: pointer; }
    
    .cart-empty { text-align: center; padding: 48px; background: #fff; border-radius: 8px; }
    .cart-empty a { color: var(--primary-color, #c62828); font-weight: 600; }
  `
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total = 0;
  totalItens = 0;
  
  // Controle de pagamento e estado
  idPagamentoSelecionado: number = 1; // 1 = PIX padrão
  isProcessing: boolean = false;

  readonly placeholderImage = 'assets/images/placeholder-comic.svg';
  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router
  ) {}

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

  // Auxiliar para URL da imagem
  getUrlImagem(nomeImagem?: string): string {
    if (!nomeImagem) return this.placeholderImage;
    return `http://localhost:8080/quadrinhos/image/download/${nomeImagem}`;
  }

  handleImageError(event: any): void {
    event.target.src = this.placeholderImage;
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
    // 1. Validação de Login
    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para finalizar a compra!');
      this.router.navigate(['/login']);
      return;
    }

    // 2. Validação do Usuário/Cliente
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario || !usuario.id) {
      alert('Erro ao identificar o usuário. Tente fazer login novamente.');
      return;
    }

    this.isProcessing = true;

    // 3. Montagem do DTO
    const pedidoDTO: PedidoDTO = {
      idCliente: usuario.id,
      idPagamento: this.idPagamentoSelecionado,
      itens: this.items.map(item => ({
        quantidade: item.quantity,
        desconto: 0.0,
        idQuadrinho: item.quadrinho.id
      }))
    };

    // 4. Envio para o Backend
    this.pedidoService.save(pedidoDTO).subscribe({
      next: () => {
        alert('Compra realizada com sucesso! Obrigado.');
        this.cartService.clear();
        this.router.navigate(['/loja']);
      },
      error: (err) => {
        console.error('Erro na compra', err);
        alert('Não foi possível finalizar a compra. Verifique se você é um Cliente cadastrado ou se há estoque.');
        this.isProcessing = false;
      }
    });
  }

  private atualizarTotais(): void {
    this.totalItens = this.items.reduce((total, item) => total + item.quantity, 0);
    this.total = this.items.reduce((total, item) => total + item.quadrinho.preco * item.quantity, 0);
  }
}
