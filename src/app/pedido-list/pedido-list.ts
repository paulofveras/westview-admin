import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PedidoDetalhesDialogComponent } from './pedido-detalhes-dialog.component';

// Imports para paginação e filtro
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    MatButtonToggleModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './pedido-list.html',
  styleUrls: ['./pedido-list.css'],
  providers: [{ provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }]
})
export class PedidoListComponent implements OnInit {
  pedidos: any[] = [];
  displayedColumns: string[] = ['id', 'data', 'cliente', 'total', 'status', 'acoes'];
  
  page = 0;
  pageSize = 10;
  length = 0;
  q = '';
  
  // Variável para controle da ordenação
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private pedidoService: PedidoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    // Passa o sortOrder para o serviço
    this.pedidoService.findPaged(this.page, this.pageSize, this.q, this.sortOrder).subscribe({
      next: (res) => {
        this.pedidos = res.data;
        this.length = this.q ? res.filteredRecords : res.totalRecords;
      },
      error: (err) => console.error('Erro ao carregar pedidos', err)
    });
  }

  pesquisar() {
    this.page = 0;
    this.load();
  }
  
  // Método chamado quando muda o botão de ordenação
  mudarOrdem() {
    this.page = 0; // Volta para a primeira página
    this.load();
  }

  paginar(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  verDetalhes(pedido: any) {
    this.dialog.open(PedidoDetalhesDialogComponent, {
      width: '600px',
      data: pedido
    });
  }

  getDataFormatada(dataArray: any): Date | null {
    if (!dataArray) return null;
    if (Array.isArray(dataArray)) {
      return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3] || 0, dataArray[4] || 0);
    }
    return new Date(dataArray);
  }
}