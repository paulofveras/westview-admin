import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Fornecedor } from '../models/pessoa.model';
import { FornecedorService } from '../services/fornecedor.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fornecedor-list.html',
  styleUrls: ['./fornecedor-list.css']
})
export class FornecedorListComponent implements OnInit {
  
  fornecedores: Fornecedor[] = [];

  // Injetamos o FornecedorService para buscar os dados e o AuthService para verificar as permissões.
  // Deixamos o authService como 'public' para que o HTML possa acessá-lo.
  constructor(private fornecedorService: FornecedorService, public authService: AuthService) {}

  ngOnInit(): void {
    // Quando o componente inicia, chamamos o serviço para buscar todos os fornecedores.
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    });
  }
}