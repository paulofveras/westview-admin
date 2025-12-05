import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CadastroService, CadastroBasicoDTO } from '../services/cadastro.service';

// Novos Imports do Material
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatStepperModule, MatInputModule, MatButtonModule, MatFormFieldModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  // Criamos grupos separados para o Stepper controlar a validação de cada passo
  pessoalForm: FormGroup;
  contatoForm: FormGroup; // Inclui telefone e endereço
  acessoForm: FormGroup;
  
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroService,
    private router: Router
  ) {
    // Passo 1: Quem é você?
    this.pessoalForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });

    // Passo 2: Onde te encontrar?
    this.contatoForm = this.fb.group({
      telefone: this.fb.group({
        codigoArea: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]]
      }),
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: ['', Validators.required],
        numero: ['', Validators.required]
      })
    });

    // Passo 3: Dados de Login
    this.acessoForm = this.fb.group({
      username: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  buscarCep() {
    // Acessa o controle dentro do grupo de contato -> endereço
    const enderecoGroup = this.contatoForm.get('endereco') as FormGroup;
    const cep = enderecoGroup.get('cep')?.value;

    if (cep && String(cep).length === 8) {
      enderecoGroup.get('rua')?.disable();

      this.cadastroService.consultarCep(cep).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            enderecoGroup.patchValue({ rua: dados.logradouro });
            document.getElementById('numeroInput')?.focus();
          } else {
            alert('CEP não encontrado.');
          }
          enderecoGroup.get('rua')?.enable();
        },
        error: () => {
          alert('Erro ao buscar CEP.');
          enderecoGroup.get('rua')?.enable();
        }
      });
    }
  }

  onSubmit() {
    if (this.pessoalForm.invalid || this.contatoForm.invalid || this.acessoForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    // Remonta o DTO juntando os pedaços
    const dto: CadastroBasicoDTO = {
      ...this.pessoalForm.value,
      ...this.contatoForm.value,
      ...this.acessoForm.value
    };

    this.cadastroService.cadastrar(dto).subscribe({
      next: () => {
        alert('Cadastro realizado! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao cadastrar.');
        this.isLoading = false;
      }
    });
  }
}