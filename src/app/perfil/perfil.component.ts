import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { AdministradorService } from '../services/administrador.service'; // Importe o serviço
import { FuncionarioService } from '../services/funcionario.service';   // Importe o serviço

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  // Usamos 'any' aqui para aceitar Cliente, Admin ou Funcionario, já que eles têm campos parecidos
  dadosUsuario: any | null = null;
  perfil: string = '';

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private adminService: AdministradorService,
    private funcService: FuncionarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioLogado = this.authService.getUsuarioLogado();
    
    if (usuarioLogado && usuarioLogado.id) {
      this.perfil = usuarioLogado.perfil || 'Usuario';
      
      // Decide qual serviço chamar com base no perfil
      if (this.perfil === 'Cliente') {
        this.clienteService.findById(usuarioLogado.id).subscribe({
          next: (dados) => this.dadosUsuario = dados,
          error: (err) => console.error(err)
        });
      } 
      else if (this.perfil === 'Administrador') {
        this.adminService.findById(usuarioLogado.id).subscribe({
          next: (dados) => this.dadosUsuario = dados,
          error: (err) => console.error(err)
        });
      }
      else if (this.perfil === 'Funcionario') {
        this.funcService.findById(usuarioLogado.id).subscribe({
          next: (dados) => this.dadosUsuario = dados,
          error: (err) => console.error(err)
        });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}