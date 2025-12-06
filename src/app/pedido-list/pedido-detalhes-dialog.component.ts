import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pedido-detalhes-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatListModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Detalhes do Pedido #{{ data.id }}</h2>
    <mat-dialog-content>
      
      <div class="info-section">
        <p><strong>Cliente:</strong> {{ data.cliente?.nome }}</p>
        
        <p><strong>Data:</strong> 
          <span *ngIf="getDataValida(data.data); else dataInvalida">
            {{ getDataValida(data.data) | date:'dd/MM/yyyy HH:mm' }}
          </span>
          <ng-template #dataInvalida>Data inválida</ng-template>
        </p>

        <p><strong>Forma de Pagamento:</strong> {{ data.pagamento?.descricao || 'Não informado' }}</p>
        
        <p><strong>Status:</strong> 
           <span [style.color]="data.statusPagamento?.id === 1 ? 'green' : 'orange'" style="font-weight: bold;">
             {{ data.statusPagamento?.nome }}
           </span>
        </p>
      </div>

      <h3>Itens do Pedido</h3>
      <div class="item-list">
        <div class="item-row" *ngFor="let item of data.itens">
          <img [src]="getUrlImagem(item.quadrinho.nomeImagem)" class="item-thumb" alt="Capa">
          <div class="item-info">
            <span class="item-title">{{ item.quadrinho.nome }}</span>
            <span class="item-desc">Qtd: {{ item.quantidade }} x {{ item.preco | currency:'BRL' }}</span>
          </div>
          <div class="item-total">
            {{ (item.quantidade * item.preco) | currency:'BRL' }}
          </div>
        </div>
      </div>

      <div class="total-section">
        <span>Total do Pedido:</span>
        <span class="total-value">{{ data.total | currency:'BRL' }}</span>
      </div>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .info-section { margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    .info-section p { margin: 8px 0; font-size: 1rem; }
    
    .item-list { display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto; margin-bottom: 10px; }
    .item-row { display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .item-thumb { width: 50px; height: 75px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
    
    .item-info { flex: 1; display: flex; flex-direction: column; }
    .item-title { font-weight: 600; font-size: 1rem; }
    .item-desc { font-size: 0.85rem; color: #666; }
    
    .item-total { font-weight: bold; color: #333; }
    
    .total-section { display: flex; justify-content: space-between; margin-top: 10px; font-size: 1.3rem; border-top: 2px solid #ccc; padding-top: 15px; }
    .total-value { color: #c62828; font-weight: 800; }

    h3 { margin-top: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
  `]
})
export class PedidoDetalhesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  getUrlImagem(nomeImagem?: string): string {
    if (!nomeImagem) return 'assets/images/placeholder-comic.svg';
    return `http://localhost:8080/quadrinhos/image/download/${nomeImagem}`;
  }

  // --- CORREÇÃO AQUI ---
  getDataValida(data: any): Date | null {
    if (!data) return null;

    // Se vier como array do Java [ano, mes, dia, hora, min, seg]
    if (Array.isArray(data)) {
      // Mes em JS começa em 0 (Janeiro)
      return new Date(
        data[0], 
        data[1] - 1, 
        data[2], 
        data[3] || 0, 
        data[4] || 0, 
        data[5] || 0
      );
    }
    
    // Se vier como string ISO
    const dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) {
      return null; // Data inválida
    }
    
    return dateObj;
  }
}