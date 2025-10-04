import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service';
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

@Component({
  selector: 'app-quadrinho-list',
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
  templateUrl: './quadrinho-list.html',
  styleUrls: ['./quadrinho-list.css'],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl } // labels em português
  ]
})
export class QuadrinhoListComponent implements OnInit {

  quadrinhos: Quadrinho[] = [];

  // >>> CONTROLES DE PAGINAÇÃO/PESQUISA
  page = 0;
  pageSize = 12;
  length = 0;   // será totalRecords ou filteredRecords, conforme q
  q = '';       // termo de pesquisa

  constructor(
    private quadrinhoService: QuadrinhoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  // >>> CARREGA USANDO O ENDPOINT /quadrinhos/paged
load(): void {
  this.quadrinhoService.findPaged(this.page, this.pageSize, this.q).subscribe(res => {
    this.quadrinhos = res.data;
    this.length = this.q ? res.filteredRecords : res.totalRecords;
  });
}

pesquisar(): void {
  this.page = 0;      // sempre voltar para a primeira página ao trocar a busca
  this.load();
}

paginar(event: PageEvent): void {
  this.page = event.pageIndex;
  this.pageSize = event.pageSize;
  this.load();
}

  getImageUrl(nomeImagem: string): string {
    return this.quadrinhoService.getImageUrl(nomeImagem);
  }

  excluir(quadrinho: Quadrinho): void {
    if (confirm(`Deseja realmente excluir o quadrinho "${quadrinho.nome}"?`)) {
      this.quadrinhoService.delete(quadrinho).subscribe({
        next: () => this.quadrinhos = this.quadrinhos.filter(q => q.id !== quadrinho.id),
        error: (err) => console.error('Erro ao excluir quadrinho', err)
      });
    }
  }
}
