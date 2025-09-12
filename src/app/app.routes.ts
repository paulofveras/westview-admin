import { Routes } from '@angular/router';
import { QuadrinhoListComponent } from './quadrinho-list/quadrinho-list';
import { QuadrinhoFormComponent } from './quadrinho-form/quadrinho-form';
import { ClienteFormComponent } from './cliente-form/cliente-form';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: '/quadrinhos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: ClienteFormComponent },
  
  // Rotas protegidas
  { path: 'quadrinhos', component: QuadrinhoListComponent },
  { path: 'quadrinhos/novo', component: QuadrinhoFormComponent, canActivate: [AuthGuard] },
  { path: 'quadrinhos/editar/:id', component: QuadrinhoFormComponent, canActivate: [AuthGuard] },
  { path: 'fornecedores/novo', component: FornecedorFormComponent, canActivate: [AuthGuard] },
  { path: 'funcionarios/novo', component: FuncionarioFormComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: '/quadrinhos' }
];