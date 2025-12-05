import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';

@Component({
  selector: 'app-quadrinho-admin-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatFormFieldModule, MatInputModule, MatChipsModule
  ],
  templateUrl: './quadrinho-admin-list.html',
  styleUrls: ['./quadrinho-admin-list.css'],
  providers: [{ provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }]
})
export class QuadrinhoAdminListComponent implements OnInit {
  quadrinhos: Quadrinho[] = [];
  displayedColumns: string[] = ['capa', 'id', 'nome', 'preco', 'estoque', 'acoes'];
  
  page = 0;
  pageSize = 10;
  length = 0;
  q = '';
  
  private imageUrls = new Map<number, string>();
  readonly placeholderImage = 'assets/images/placeholder-comic.svg';

  constructor(private quadrinhoService: QuadrinhoService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.quadrinhoService.findPaged(this.page, this.pageSize, this.q).subscribe({
      next: (res) => {
        this.quadrinhos = res.data;
        this.length = this.q ? res.filteredRecords : res.totalRecords;
        this.populateImages(this.quadrinhos);
      },
      error: (err) => console.error('Erro ao carregar quadrinhos', err)
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

  excluir(quadrinho: Quadrinho): void {
    if (confirm(`Deseja excluir "${quadrinho.nome}" do sistema?`)) {
      this.quadrinhoService.delete(quadrinho).subscribe(() => this.load());
    }
  }

  // --- Lógica de Imagens (igual ao da loja para reaproveitar) ---
  getImageSrc(quadrinho: Quadrinho): string {
    return this.imageUrls.get(quadrinho.id) ?? this.placeholderImage;
  }

  private populateImages(quadrinhos: Quadrinho[]): void {
    quadrinhos.forEach(q => {
      if (q.nomeImagem && !this.imageUrls.has(q.id)) {
        this.quadrinhoService.downloadImagem(q.nomeImagem).subscribe(blob => {
          const url = URL.createObjectURL(blob);
          this.imageUrls.set(q.id, url);
        });
      }
    });
  }
}