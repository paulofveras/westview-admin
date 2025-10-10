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
import { fornecedorResolver } from './resolvers/fornecedor.resolver';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'dashboard', component: AdminDashboardComponent, canActivate: [authGuard]},
    {path: 'quadrinhos/list', component: QuadrinhoListComponent, canActivate: [authGuard]},
    {path: 'quadrinhos/new', component: QuadrinhoFormComponent, canActivate: [authGuard]},
    {path: 'quadrinhos/edit/:id', component: QuadrinhoFormComponent, resolve: {quadrinho: quadrinhoResolver}, canActivate: [authGuard]},
    {path: 'fornecedores/list', component: FornecedorListComponent, canActivate: [authGuard]},
    {path: 'fornecedores/new', component: FornecedorFormComponent, canActivate: [authGuard]},
    // ADICIONAR RESOLVER AQUI
    {path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: {fornecedor: fornecedorResolver}, canActivate: [authGuard]},
];