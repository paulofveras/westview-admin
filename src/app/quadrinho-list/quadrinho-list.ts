import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// CORREÇÃO: Importando o modelo do local correto
import { Quadrinho } from '../models/quadrinho.model'; 
import { QuadrinhoService } from '../services/quadrinho.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quadrinho-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quadrinho-list.html',
  styleUrls: ['./quadrinho-list.css']
})
export class QuadrinhoListComponent implements OnInit {

  quadrinhos: Quadrinho[] = [];

  constructor(private quadrinhoService: QuadrinhoService, public authService: AuthService) {}

  ngOnInit(): void {
    this.quadrinhoService.findAll().subscribe(data => {
      this.quadrinhos = data;
    });
  }

  // CORREÇÃO: A função agora recebe o objeto 'quadrinho' inteiro
  excluir(quadrinho: Quadrinho): void {
    if (confirm(`Deseja realmente excluir o quadrinho "${quadrinho.nome}"?`)) {
      this.quadrinhoService.delete(quadrinho).subscribe({
        next: () => {
          this.quadrinhos = this.quadrinhos.filter(q => q.id !== quadrinho.id);
        },
        error: (err) => {
          console.error('Erro ao excluir quadrinho', err);
        }
      });
    }
  }
}