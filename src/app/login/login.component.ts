import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' = 'erro';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      senha: ['', Validators.required],
      perfil: [1, Validators.required] // 1 = Funcionario, 2 = Cliente, 3 = Administrador
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/quadrinhos/list']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro no login', err);
        this.mensagem = 'Usuario ou senha invalidos.';
        this.tipoMensagem = 'erro';
      }
    });
  }
}
