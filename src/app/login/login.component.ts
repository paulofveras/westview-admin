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
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      perfil: ['1', Validators.required] // 1 = Funcionário, 2 = Cliente
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const { username, password, perfil } = this.form.value;

      this.authService.login(username, password, parseInt(perfil)).pipe(
        catchError(error => {
          this.mostrarMensagem('Usuário ou senha inválidos', 'erro');
          this.isLoading = false;
          return of(null);
        })
      ).subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.mostrarMensagem('Login realizado com sucesso!');
          setTimeout(() => {
            this.router.navigate(['/quadrinhos']);
          }, 1000);
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