import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
// --- NOVO IMPORT ---
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule // --- ADICIONADO NO IMPORTS ---
  ],
  templateUrl: './quadrinho-list.html',
  styleUrls: ['./quadrinho-list.css'],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }
  ]
})
export class QuadrinhoListComponent implements OnInit, OnDestroy {

  quadrinhos: Quadrinho[] = [];
  readonly placeholderImage = 'assets/images/placeholder-comic.svg';
  private imageUrls = new Map<number, string>();
  private subscriptions = new Subscription();

  page = 0;
  pageSize = 12;
  length = 0;
  q = '';
  isPublicView = false;
  cartCount = 0;

  constructor(
    private quadrinhoService: QuadrinhoService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar // --- INJEÇÃO DO SNACKBAR ---
  ) {}

  ngOnInit(): void {
    this.isPublicView = this.route.snapshot.data?.['publicView'] ?? false;
    this.subscriptions.add(
      this.cartService.items$.subscribe(items => {
        this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      })
    );
    this.load();
  }

  ngOnDestroy(): void {
    this.clearImageCache();
    this.subscriptions.unsubscribe();
  }

  load(): void {
    this.quadrinhoService.findPaged(this.page, this.pageSize, this.q).subscribe(res => {
      this.quadrinhos = res.data;
      this.length = this.q ? res.filteredRecords : res.totalRecords;
      this.populateImages(this.quadrinhos);
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

  getImageSrc(quadrinho: Quadrinho): string {
    return this.imageUrls.get(quadrinho.id) ?? this.placeholderImage;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.placeholderImage;
  }

  excluir(quadrinho: Quadrinho): void {
    if (this.isPublicView) {
      return;
    }
    if (confirm(`Deseja realmente excluir o quadrinho "${quadrinho.nome}"?`)) {
      this.quadrinhoService.delete(quadrinho).subscribe({
        next: () => this.quadrinhos = this.quadrinhos.filter(q => q.id !== quadrinho.id),
        error: (err) => console.error('Erro ao excluir quadrinho', err)
      });
    }
  }

  adicionarAoCarrinho(quadrinho: Quadrinho): void {
    this.cartService.addItem(quadrinho);
    
    // --- LÓGICA DO POPUP (SNACKBAR) ---
    this.snackBar.open(`${quadrinho.nome} adicionado ao carrinho!`, 'Fechar', {
      duration: 3000, // 3 segundos
      horizontalPosition: 'center',
      verticalPosition: 'top', // Aparece no topo
      panelClass: ['snackbar-success'] // Podemos estilizar se quiser
    });
  }

  private populateImages(quadrinhos: Quadrinho[]): void {
    const idsOnPage = new Set(quadrinhos.map(q => q.id));

    for (const [id, url] of Array.from(this.imageUrls.entries())) {
      if (!idsOnPage.has(id)) {
        URL.revokeObjectURL(url);
        this.imageUrls.delete(id);
      }
    }

    quadrinhos.forEach(quadrinho => {
      if (!quadrinho.nomeImagem) {
        const existing = this.imageUrls.get(quadrinho.id);
        if (existing) {
          URL.revokeObjectURL(existing);
          this.imageUrls.delete(quadrinho.id);
        }
        return;
      }

      this.quadrinhoService.downloadImagem(quadrinho.nomeImagem).subscribe({
        next: (blob) => {
          const existing = this.imageUrls.get(quadrinho.id);
          if (existing) {
            URL.revokeObjectURL(existing);
          }
          const objectUrl = URL.createObjectURL(blob);
          this.imageUrls.set(quadrinho.id, objectUrl);
        },
        error: () => {
          const existing = this.imageUrls.get(quadrinho.id);
          if (existing) {
            URL.revokeObjectURL(existing);
            this.imageUrls.delete(quadrinho.id);
          }
        }
      });
    });
  }

  private clearImageCache(): void {
    for (const url of this.imageUrls.values()) {
      URL.revokeObjectURL(url);
    }
    this.imageUrls.clear();
  }
}
