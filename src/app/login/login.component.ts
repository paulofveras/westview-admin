import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'erro';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      perfil: ['1', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const { username, password, perfil } = this.form.value;

      this.authService.login(username, password, parseInt(perfil)).pipe(
        catchError(error => {
          this.isLoading = false;
          console.error('Erro no login:', error);
          if (error.status === 401 || error.status === 404) {
            this.mostrarMensagem('Usuário ou senha inválidos', 'erro');
          } else {
            this.mostrarMensagem('Erro de conexão. Tente novamente.', 'erro');
          }
          return of(null);
        })
      ).subscribe(response => {
        this.isLoading = false;
        if (response) {
          console.log('Login bem-sucedido!', response);
          this.mostrarMensagem('Login realizado com sucesso!', 'sucesso');
          
          // Debug: verificar se o token foi salvo
          this.authService.debugAuth();
          
          // Redirecionar após breve delay
          setTimeout(() => {
            this.router.navigate(['/quadrinhos']);
          }, 1000);
        } else {
          this.mostrarMensagem('Erro no login. Tente novamente.', 'erro');
        }
      });
    }
  }

  private mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => this.mensagem = '', 3000);
  }
}