import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CadastroService, CadastroBasicoDTO } from '../services/cadastro.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]], // <--- NOVO CAMPO
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      
      // Grupos aninhados para Endereço e Telefone
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
        numero: ['', Validators.required]
      }),
      
      endereco: this.fb.group({
        cep: ['', Validators.required],
        rua: ['', Validators.required],
        numero: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const dto = this.form.value as CadastroBasicoDTO;

    this.cadastroService.cadastrar(dto).subscribe({
      next: (cliente) => {
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        alert('Erro ao realizar cadastro. Verifique os dados.');
        this.isLoading = false;
      }
    });
  }
}