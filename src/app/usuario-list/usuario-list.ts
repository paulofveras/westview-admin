import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { UsuarioListItem } from '../models/pessoa.model';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
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
  providers: [{ provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }]
})
export class UsuarioListComponent implements OnInit {
  usuarios: UsuarioListItem[] = [];
  page = 0;
  pageSize = 10;
  length = 0;
  q = '';

  constructor(
    private usuarioService: UsuarioService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.usuarioService.findPaged(this.page, this.pageSize, this.q).subscribe({
      next: (result) => {
        this.usuarios = result.data;
        this.length = this.q ? result.filteredRecords : result.totalRecords;
      },
      error: (error) => console.error('Erro ao carregar usuários', error)
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

  excluir(usuario: UsuarioListItem): void {
    if (!usuario.id) {
      return;
    }

    if (confirm(`Deseja realmente excluir o usuário "${usuario.username}"?`)) {
      this.usuarioService.delete(usuario.id).subscribe({
        next: () => this.load(),
        error: (error) => console.error('Erro ao excluir usuário', error)
      });
    }
  }
}
