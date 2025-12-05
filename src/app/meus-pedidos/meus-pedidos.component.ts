import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs'; // Para as abas
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTabsModule, 
    MatCardModule, 
    MatListModule,
    MatIconModule
  ],
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.css']
})
export class MeusPedidosComponent implements OnInit {
  pedidosEmAndamento: any[] = [];
  pedidosEntregues: any[] = [];
  loading = true;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.pedidoService.meusPedidos().subscribe({
      next: (pedidos) => {
        // Lógica de separação (Adaptada ao seu Enum Status)
        // SeStatus.PAGO (id=1) -> Vamos considerar "Concluído/Entregue" para o exemplo
        // Se Status.NAO_PAGO (id=2) -> "Em Andamento"
        
        this.pedidosEntregues = pedidos.filter(p => p.statusPagamento.id === 1);
        this.pedidosEmAndamento = pedidos.filter(p => p.statusPagamento.id === 2);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos', err);
        this.loading = false;
      }
    });
  }
}