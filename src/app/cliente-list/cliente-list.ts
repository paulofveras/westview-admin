import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Cliente } from '../models/pessoa.model';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }]
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  page = 0;
  pageSize = 10;
  length = 0;
  q = '';

  constructor(
    private clienteService: ClienteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.clienteService.findPaged(this.page, this.pageSize, this.q).subscribe({
      next: (result) => {
        this.clientes = result.data;
        this.length = this.q ? result.filteredRecords : result.totalRecords;
      },
      error: (error) => console.error('Erro ao carregar clientes', error)
    });
  }

  pesquisar(): void {
    this.page = 0;
    this.load();
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  excluir(cliente: Cliente): void {
    if (!cliente.id) {
      return;
    }

    if (confirm(`Deseja realmente excluir o cliente "${cliente.nome}"?`)) {
      this.clienteService.delete(cliente.id).subscribe({
        next: () => this.load(),
        error: (error) => console.error('Erro ao excluir cliente', error)
      });
    }
  }
}
