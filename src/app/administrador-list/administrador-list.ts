import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Administrador } from '../models/pessoa.model';
import { AdministradorService } from '../services/administrador.service';
import { AuthService } from '../services/auth.service';
import { getPtBrPaginatorIntl } from '../shared/paginator-ptbr';

@Component({
  selector: 'app-administrador-list',
  standalone: true,
  templateUrl: './administrador-list.html',
  styleUrl: './administrador-list.css',
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
export class AdministradorListComponent implements OnInit {
  administradores: Administrador[] = [];
  page = 0;
  pageSize = 10;
  length = 0;
  q = '';

  constructor(
    private administradorService: AdministradorService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.administradorService.findPaged(this.page, this.pageSize, this.q).subscribe({
      next: (result) => {
        this.administradores = result.data;
        this.length = this.q ? result.filteredRecords : result.totalRecords;
      },
      error: (error) => console.error('Erro ao carregar administradores', error)
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

  excluir(administrador: Administrador): void {
    if (!administrador.id) {
      return;
    }

    if (confirm(`Deseja realmente excluir o administrador "${administrador.nome}"?`)) {
      this.administradorService.delete(administrador.id).subscribe({
        next: () => this.load(),
        error: (error) => console.error('Erro ao excluir administrador', error)
      });
    }
  }
}
