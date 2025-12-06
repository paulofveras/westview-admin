import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { Quadrinho } from '../models/quadrinho.model';
import { QuadrinhoService } from '../services/quadrinho.service'; // Para baixar imagens
import { RouterModule } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meus-favoritos',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './meus-favoritos.html',
  styleUrls: ['./meus-favoritos.css']
})
export class MeusFavoritosComponent implements OnInit {
  favoritos: Quadrinho[] = [];
  loading = true;
  
  // Cache de URLs de imagem (igual ao da lista principal)
  private imageUrls = new Map<number, string>();
  readonly placeholderImage = 'assets/images/placeholder-comic.svg';

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private quadrinhoService: QuadrinhoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarFavoritos();
  }

  carregarFavoritos() {
    const usuario = this.authService.getUsuarioLogado();
    if (usuario && usuario.id) {
      this.clienteService.getFavoritos(usuario.id).subscribe({
        next: (data) => {
          this.favoritos = data;
          this.loading = false;
          this.populateImages(this.favoritos);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  remover(quadrinho: Quadrinho) {
    const usuario = this.authService.getUsuarioLogado();
    if (usuario && usuario.id) {
      this.clienteService.removerFavorito(usuario.id, quadrinho.id).subscribe(() => {
        // Remove da lista localmente
        this.favoritos = this.favoritos.filter(q => q.id !== quadrinho.id);
        this.snackBar.open('Removido dos favoritos', 'OK', { duration: 2000 });
      });
    }
  }

  // --- Lógica de Imagem (Reaproveitada) ---
  getImageSrc(quadrinho: Quadrinho): string {
    return this.imageUrls.get(quadrinho.id) ?? this.placeholderImage;
  }

  private populateImages(quadrinhos: Quadrinho[]): void {
    quadrinhos.forEach(quadrinho => {
      if (quadrinho.nomeImagem && !this.imageUrls.has(quadrinho.id)) {
        this.quadrinhoService.downloadImagem(quadrinho.nomeImagem).subscribe(blob => {
          const url = URL.createObjectURL(blob);
          this.imageUrls.set(quadrinho.id, url);
        });
      }
    });
  }
}