import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Renomeado de volta para 'form' para corresponder ao HTML
  form: FormGroup; 
  
  // Adicionadas as propriedades que o HTML esperava
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'erro';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      senha: ['', Validators.required],
      perfil: [1, Validators.required] // Perfil 1 = Funcionario por padrão
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true; // Ativa o estado de carregamento
      this.authService.login(this.form.value).subscribe({
        next: (response) => {
          this.isLoading = false; // Desativa o carregamento
          console.log('Login bem-sucedido', response);
          this.router.navigate(['/quadrinhos/list']);
        },
        error: (err) => {
          this.isLoading = false; // Desativa o carregamento
          console.error('Erro no login', err);
          // Define a mensagem de erro para ser exibida no HTML
          this.mensagem = 'Usuário ou senha inválidos.';
          this.tipoMensagem = 'erro';
        }
      });
    }
  }
}