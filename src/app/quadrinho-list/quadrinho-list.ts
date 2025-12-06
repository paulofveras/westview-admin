import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Adicione Router
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service';
import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service'; // Novo
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
    MatSnackBarModule
  ],
  templateUrl: './quadrinho-list.html',
  styleUrls: ['./quadrinho-list.css'],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }
  ]
})
export class QuadrinhoListComponent implements OnInit, OnDestroy {

  quadrinhos: Quadrinho[] = [];
  favoritos: Set<number> = new Set(); // Armazena os IDs dos favoritos
  
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
    private clienteService: ClienteService, // Injete o ClienteService
    private route: ActivatedRoute,
    private router: Router, // Injete o Router
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isPublicView = this.route.snapshot.data?.['publicView'] ?? false;
    this.subscriptions.add(
      this.cartService.items$.subscribe(items => {
        this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      })
    );
    this.load();
    this.carregarFavoritos(); // Carrega os favoritos ao iniciar
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

  // Busca os favoritos do usuário logado
  carregarFavoritos() {
    if (this.authService.isLoggedIn()) {
      const usuario = this.authService.getUsuarioLogado();
      if (usuario && usuario.id) {
        this.clienteService.getFavoritos(usuario.id).subscribe({
          next: (favs) => {
            this.favoritos = new Set(favs.map(q => q.id));
          },
          error: (err) => console.error('Erro ao carregar favoritos', err)
        });
      }
    }
  }

  // Ação do botão de coração
  toggleFavorito(quadrinho: Quadrinho) {
    if (!this.authService.isLoggedIn()) {
      // Redireciona para cadastro se não estiver logado
      this.router.navigate(['/cadastro']);
      return;
    }

    const usuario = this.authService.getUsuarioLogado();
    if (!usuario || !usuario.id) return;

    if (this.favoritos.has(quadrinho.id)) {
      // Se já é favorito, remove
      this.clienteService.removerFavorito(usuario.id, quadrinho.id).subscribe(() => {
        this.favoritos.delete(quadrinho.id);
        this.snackBar.open('Removido dos favoritos', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    } else {
      // Se não é, adiciona
      this.clienteService.adicionarFavorito(usuario.id, quadrinho.id).subscribe(() => {
        this.favoritos.add(quadrinho.id);
        this.snackBar.open('Adicionado aos favoritos ❤️', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    }
  }

  // Verifica se é favorito para pintar o ícone
  isFavorito(quadrinho: Quadrinho): boolean {
    return this.favoritos.has(quadrinho.id);
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
    this.snackBar.open(`${quadrinho.nome} adicionado ao carrinho!`, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
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
