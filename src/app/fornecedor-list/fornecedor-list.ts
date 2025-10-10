import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../models/pessoa.model';
import { FornecedorService } from '../services/fornecedor.service';
import { AuthService } from '../services/auth.service';

// >>> IMPORTS DO PAGINATOR
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

// >>> PT-BR para o paginator (arquivo novo logo abaixo)
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.html',
  standalone: true,
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
  styleUrls: ['./fornecedor-list.css']
})
export class FornecedorListComponent implements OnInit {

  fornecedores: Fornecedor[] = [];

  // Controles de paginação e pesquisa
  page = 0;
  pageSize = 10;
  length = 0;
  q = '';

  constructor(
    private fornecedorService: FornecedorService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.fornecedorService.findPaged(this.page, this.pageSize, this.q).subscribe(res => {
      this.fornecedores = res.data;
      // CORREÇÃO APLICADA AQUI: Usa o total filtrado se houver busca
      this.length = this.q ? res.filteredRecords : res.totalRecords;
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

  excluir(fornecedor: Fornecedor): void {
    if (confirm(`Deseja realmente excluir o fornecedor "${fornecedor.nome}"?`)) {
      this.fornecedorService.delete(fornecedor.id).subscribe({
        next: () => {
          // Recarrega a lista para refletir a exclusão
          this.load();
        },
        error: (err) => console.error('Erro ao excluir fornecedor', err)
      });
    }
  }
}