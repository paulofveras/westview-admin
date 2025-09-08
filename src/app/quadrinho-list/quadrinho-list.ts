import { Component, OnInit } from '@angular/core';
// Importe os módulos necessários aqui
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

import { Quadrinho, QuadrinhoService } from '../services/quadrinho'; // Assumi que o nome do arquivo de serviço é quadrinho.service.ts

@Component({
  selector: 'app-quadrinho-list',
  standalone: true, // 1. Declare o componente como standalone
  imports: [
    CommonModule,   // 2. Importe o CommonModule (fornece *ngFor, currency pipe, etc.)
    RouterModule    // 3. Importe o RouterModule (fornece routerLink)
  ],
  templateUrl: './quadrinho-list.html', // Corrigi para .html, que é o padrão
  styleUrls: ['./quadrinho-list.css'],
  // Remova a linha 'providers' daqui, não é o lugar certo para pipes
})
export class QuadrinhoListComponent implements OnInit {
  // O resto do seu código continua igual...
  quadrinhos: Quadrinho[] = [];

  constructor(private service: QuadrinhoService) {}

  ngOnInit(): void {
    this.carregarQuadrinhos();
  }

  carregarQuadrinhos(): void {
    this.service.findAll().subscribe(data => {
      this.quadrinhos = data;
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este quadrinho?')) {
      this.service.delete(id).subscribe(() => {
        this.carregarQuadrinhos();
      });
    }
  }
}