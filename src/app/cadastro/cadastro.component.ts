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
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // Validação simples de 11 dígitos
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      
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
  }

  // --- NOVO MÉTODO: Busca CEP e preenche endereço ---
  buscarCep() {
    const cepControl = this.form.get('endereco.cep');
    const cep = cepControl?.value;

    if (cep && cep.length === 8) {
      // Desabilita o campo rua enquanto busca para dar feedback visual
      this.form.get('endereco.rua')?.disable();

      this.cadastroService.consultarCep(cep).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            this.form.patchValue({
              endereco: {
                rua: dados.logradouro
                // O backend atual só aceita Rua, CEP e Número.
                // Se o backend aceitasse Bairro/Cidade/UF, preencheríamos aqui.
              }
            });
            // Foca no número para facilitar a vida do usuário
            document.getElementById('numeroInput')?.focus();
          } else {
            alert('CEP não encontrado.');
          }
          this.form.get('endereco.rua')?.enable();
        },
        error: () => {
          alert('Erro ao buscar CEP.');
          this.form.get('endereco.rua')?.enable();
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Faz os erros vermelhos aparecerem se clicar em salvar vazio
      return;
    }

    this.isLoading = true;
    
    // Precisamos reabilitar campos desabilitados (se houver) para o valor entrar no DTO
    this.form.get('endereco.rua')?.enable();
    
    const dto = this.form.value as CadastroBasicoDTO;

    this.cadastroService.cadastrar(dto).subscribe({
      next: (cliente) => {
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        alert('Erro ao realizar cadastro. Verifique os dados (ex: CPF já existente).');
        this.isLoading = false;
      }
    });
  }
}