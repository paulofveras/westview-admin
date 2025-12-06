import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuadrinhoService } from '../services/quadrinho.service';
import { CartService } from '../services/cart.service';
import { Quadrinho } from '../models/quadrinho.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quadrinho-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, 
    MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './quadrinho-detail.html',
  styleUrls: ['./quadrinho-detail.css']
})
export class QuadrinhoDetailComponent implements OnInit {
  quadrinho: Quadrinho | null = null;
  recomendados: Quadrinho[] = [];
  readonly placeholderImage = 'assets/images/placeholder-comic.svg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quadrinhoService: QuadrinhoService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Escuta mudanças na URL (para quando clicar em um recomendado)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.carregarProduto(id);
      }
    });
  }

  carregarProduto(id: number) {
    // 1. Busca o produto principal
    this.quadrinhoService.findById(String(id)).subscribe(q => {
      this.quadrinho = q;
      this.carregarRecomendados(q.id);
    });
  }

  carregarRecomendados(idAtual: number) {
    // 2. Busca todos para sugerir (na vida real seria um endpoint específico, mas aqui simulamos)
    this.quadrinhoService.findAll().subscribe(lista => {
      // Filtra o atual e pega os 4 primeiros
      this.recomendados = lista
        .filter(q => q.id !== idAtual)
        .slice(0, 4);
    });
  }

  adicionarAoCarrinho() {
    if (this.quadrinho) {
      this.cartService.addItem(this.quadrinho);
      this.snackBar.open(`${this.quadrinho.nome} adicionado!`, 'OK', {
        duration: 2000,
        verticalPosition: 'top'
      });
    }
  }

  getUrlImagem(nomeImagem?: string): string {
    if (!nomeImagem) return this.placeholderImage;
    return `http://localhost:8080/quadrinhos/image/download/${nomeImagem}`;
  }
}