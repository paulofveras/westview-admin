import { Routes } from '@angular/router';
import { QuadrinhoListComponent } from './quadrinho-list/quadrinho-list';
import { QuadrinhoFormComponent } from './quadrinho-form/quadrinho-form';
import { ClienteFormComponent } from './cliente-form/cliente-form';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form';
import { FornecedorListComponent } from './fornecedor-list/fornecedor-list';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: '/quadrinhos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: ClienteFormComponent },
  
  // Rotas protegidas
    { 
        path: 'quadrinhos', 
        canActivate: [authGuard], 
        data: { roles: ['Funcionario'] },
        children: [
            { path: 'list', component: QuadrinhoListComponent },
            { path: 'new', component: QuadrinhoFormComponent },
            { path: 'edit/:id', component: QuadrinhoFormComponent }
        ]
    },

    { 
        path: 'fornecedores', 
        canActivate: [authGuard],
        data: { roles: ['Funcionario'] },
        children: [
            // Rota para a lista de fornecedores
            { path: 'list', component: FornecedorListComponent },
            // Rotas para o formulário
            { path: 'new', component: FornecedorFormComponent },
            { path: 'edit/:id', component: FornecedorFormComponent }
        ]
    },
        { 
        path: 'funcionarios', 
        canActivate: [authGuard],
        data: { roles: ['Funcionario'] },
        children: [
            // Rotas para o formulário
            { path: 'new', component: FuncionarioFormComponent },
            { path: 'edit/:id', component: FuncionarioFormComponent }
        ]
    },
            { 
        path: 'clientes', 
        canActivate: [authGuard],
        data: { roles: ['Funcionario'] },
        children: [
            // Rotas para o formulário
            { path: 'edit/:id', component: ClienteFormComponent }
        ]
    },
  //{ path: 'funcionarios/novo', data: { roles: ['Funcionario'] }, component: FuncionarioFormComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '/quadrinhos' }
];