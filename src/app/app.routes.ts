import { Routes } from '@angular/router';
import { QuadrinhoListComponent } from './quadrinho-list/quadrinho-list';
import { QuadrinhoFormComponent } from './quadrinho-form/quadrinho-form';
import { ClienteFormComponent } from './cliente-form/cliente-form';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form';
import { FornecedorListComponent } from './fornecedor-list/fornecedor-list';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guards';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { quadrinhoResolver } from './resolvers/quadrinho.resolver';

export const routes: Routes = [
    { path: 'cadastro', component: ClienteFormComponent },    
    { path: 'login', component: LoginComponent },
    // Redirecionamento principal agora aponta para o novo dashboard
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    // Nova rota para o dashboard
    { 
      path: 'dashboard', 
      component: AdminDashboardComponent,
      canActivate: [authGuard],
      data: { roles: ['Funcionario'] }
    },

  
  // Rotas protegidas
    { 
        path: 'quadrinhos', 
        canActivate: [authGuard], 
        data: { roles: ['Funcionario'] },
        children: [
            { path: 'list', component: QuadrinhoListComponent },
            // Rota para novo quadrinho
            { path: 'new', component: QuadrinhoFormComponent },
            // Rota de edição agora usa o resolver
            { 
              path: 'edit/:id', 
              component: QuadrinhoFormComponent,
              // O Angular vai executar 'quadrinhoResolver' e disponibilizar o resultado
              // na propriedade 'quadrinho' dos dados da rota.
              resolve: { quadrinho: quadrinhoResolver } 
            }
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