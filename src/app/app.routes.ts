import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { CarrinhoComponent } from './carrinho';
import { ClienteFormComponent } from './cliente-form/cliente-form';
import { ClienteListComponent } from './cliente-list/cliente-list';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form';
import { FornecedorListComponent } from './fornecedor-list/fornecedor-list';
import { LoginComponent } from './login/login.component';
import { QuadrinhoFormComponent } from './quadrinho-form/quadrinho-form';
import { QuadrinhoListComponent } from './quadrinho-list/quadrinho-list';
import { AdministradorFormComponent } from './administrador-form/administrador-form';
import { AdministradorListComponent } from './administrador-list/administrador-list';
import { UsuarioFormComponent } from './usuario-form/usuario-form';
import { UsuarioListComponent } from './usuario-list/usuario-list';
import { authGuard } from './guards/auth.guards';
import { quadrinhoResolver } from './resolvers/quadrinho.resolver';
import { fornecedorResolver } from './resolvers/fornecedor.resolver';
import { clienteResolver } from './resolvers/cliente.resolver';
import { administradorResolver } from './resolvers/administrador.resolver';
import { usuarioResolver } from './resolvers/usuario.resolver';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'loja', pathMatch: 'full' },
  { path: 'loja', component: QuadrinhoListComponent, data: { publicView: true } },
  { path: 'carrinho', component: CarrinhoComponent },

  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },

  {
    path: 'quadrinhos/list',
    component: QuadrinhoListComponent,
    canActivate: [authGuard],
    data: { roles: ['Funcionario', 'Cliente'], publicView: false }
  },
  { path: 'quadrinhos/new', component: QuadrinhoFormComponent, canActivate: [authGuard] },
  {
    path: 'quadrinhos/edit/:id',
    component: QuadrinhoFormComponent,
    resolve: { quadrinho: quadrinhoResolver },
    canActivate: [authGuard]
  },

  { path: 'fornecedores/list', component: FornecedorListComponent, canActivate: [authGuard] },
  { path: 'fornecedores/new', component: FornecedorFormComponent, canActivate: [authGuard] },
  {
    path: 'fornecedores/edit/:id',
    component: FornecedorFormComponent,
    resolve: { fornecedor: fornecedorResolver },
    canActivate: [authGuard]
  },

  {
    path: 'clientes/list',
    component: ClienteListComponent,
    canActivate: [authGuard],
    data: { roles: ['Funcionario', 'Administrador'] }
  },
  {
    path: 'clientes/new',
    component: ClienteFormComponent,
    resolve: { cliente: clienteResolver },
    canActivate: [authGuard],
    data: { roles: ['Funcionario', 'Administrador'] }
  },
  {
    path: 'clientes/edit/:id',
    component: ClienteFormComponent,
    resolve: { cliente: clienteResolver },
    canActivate: [authGuard],
    data: { roles: ['Funcionario', 'Administrador'] }
  },

  {
    path: 'administradores/list',
    component: AdministradorListComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'administradores/new',
    component: AdministradorFormComponent,
    resolve: { administrador: administradorResolver },
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'administradores/edit/:id',
    component: AdministradorFormComponent,
    resolve: { administrador: administradorResolver },
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },

  {
    path: 'usuarios/list',
    component: UsuarioListComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'usuarios/new',
    component: UsuarioFormComponent,
    resolve: { usuario: usuarioResolver },
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'usuarios/edit/:id',
    component: UsuarioFormComponent,
    resolve: { usuario: usuarioResolver },
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  }
];
