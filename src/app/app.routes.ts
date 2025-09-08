import { Routes } from '@angular/router';
import { QuadrinhoListComponent } from './quadrinho-list/quadrinho-list';
import { QuadrinhoFormComponent } from './quadrinho-form/quadrinho-form';

// Este é o formato correto para projetos standalone
export const routes: Routes = [
  // Quando a URL for /quadrinhos, mostre a lista
  { path: 'quadrinhos', component: QuadrinhoListComponent },
  // Quando for /quadrinhos/novo, mostre o formulário para criar
  { path: 'quadrinhos/novo', component: QuadrinhoFormComponent },
  // Quando for /quadrinhos/editar/:id, mostre o formulário para editar
  { path: 'quadrinhos/editar/:id', component: QuadrinhoFormComponent },
  // Redireciona a rota principal '' para '/quadrinhos'
  { path: '', redirectTo: '/quadrinhos', pathMatch: 'full' }
];
