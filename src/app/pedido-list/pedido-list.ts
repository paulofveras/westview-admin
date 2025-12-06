import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; // Importante para o tooltip
import { PedidoDetalhesDialogComponent } from './pedido-detalhes-dialog.component';

@Component({
  selector: 'app-pedido-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './pedido-list.html',
  styleUrls: ['./pedido-list.css']
})
export class PedidoListComponent implements OnInit {
  pedidos: any[] = [];
  displayedColumns: string[] = ['id', 'data', 'cliente', 'total', 'status', 'acoes'];

  constructor(
    private pedidoService: PedidoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.pedidoService.findAll().subscribe({
      next: (dados) => {
        this.pedidos = dados;
        // Ordenação decrescente por data
        this.pedidos.sort((a, b) => {
             const dateA = this.getDataFormatada(a.data);
             const dateB = this.getDataFormatada(b.data);
             return dateB.getTime() - dateA.getTime();
        });
      },
      error: (err) => console.error('Erro ao carregar pedidos', err)
    });
  }

  verDetalhes(pedido: any) {
    this.dialog.open(PedidoDetalhesDialogComponent, {
      width: '600px',
      data: pedido
    });
  }

  // Helper para corrigir data (se vier array do Java)
  getDataFormatada(dataArray: any): Date {
    if (!dataArray) return new Date();
    if (Array.isArray(dataArray)) {
      // [ano, mes, dia, hora, minuto, segundo]
      return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3], dataArray[4], dataArray[5] || 0);
    }
    return new Date(dataArray);
  }
}